package main

import (
	"context"
	"errors"
	"myblog/internal/auth"
	"myblog/internal/config"
	"myblog/internal/database"
	"myblog/internal/handler"
	"myblog/internal/middleware"
	"myblog/internal/repository"
	"myblog/internal/router"
	"myblog/internal/service"
	"myblog/log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"
	_ "time/tzdata"
)

func main() {
	log.LogSetting()

	cfg, err := config.Load("configs/config.yaml")
	if err != nil {
		log.Logger.Error("加载配置失败", "error", err)
		panic(err)
	}
	err = database.InitRedis(&cfg.Redis)
	if err != nil {
		log.Logger.Error("Redis初始化失败", "error", err)
		panic(err)
	}
	defer database.CloseRedis()
	err = database.InitPostgres(&cfg.Database)
	if err != nil {
		log.Logger.Error("PostgreSQL初始化失败", "error", err)
		panic(err)
	}
	defer database.ClosePostgres()

	// 启动浏览/点赞计数定时同步（每 10 分钟 Redis → DB）
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()
	if os.Getenv("VISIT_STREAM_ENABLED") != "true" && database.DB.Migrator().HasTable("visit_migrations") {
		var active int64
		if e := database.DB.Table("visit_migrations").Where("name = ?", "stream-v2").Count(&active).Error; e != nil {
			panic(e)
		}
		if active != 0 {
			panic("stream-v2 baseline exists: disabling streams requires an explicit offline rollback")
		}
	}
	if os.Getenv("VISIT_STREAM_ENABLED") == "true" {
		opts, e := service.VisitOptionsFromEnv()
		if e != nil {
			panic(e)
		}
		service.Visits = &service.VisitPipeline{Options: opts}
		if e = service.Visits.Start(ctx); e != nil {
			panic(e)
		}
	}
	syncDone := make(chan struct{})
	go func() { defer close(syncDone); service.StartSyncScheduler(ctx) }()

	// newArticle := model.Article{
	// 	Title:   "我的第一篇 Postgres 博客",
	// 	Content: "这是 Markdown 内容...",
	// 	Stage:   "published",
	// 	Vol:     1,
	// 	// 【关键修改】不要写死 1，而是用刚才生成的 testUser.ID
	// 	AuthorID: testUser.ID,
	// 	Tags:     pq.StringArray{"Golang", "PostgreSQL", "后端"},
	// }

	// database.DBCreate(&newArticle)
	//database.DBRead(4)
	tokenManager := auth.NewTokenManager(
		cfg.Auth.TokenSecret,
		time.Duration(cfg.Auth.TokenTTLHours)*time.Hour,
	)
	userRepo := repository.NewUserRepository(database.DB)
	articleRepo := repository.NewArticleRepository(database.DB)
	homeContentRepo := repository.NewHomeContentRepository(database.DB)
	travelPlaceRepo := repository.NewTravelPlaceRepository(database.DB)
	visitRecordRepo := repository.NewVisitRecordRepository(database.DB)
	apiKeyRepo := repository.NewAPIKeyRepository(database.DB)
	authService := service.NewAuthService(userRepo, tokenManager)
	articleService := service.NewArticleService(articleRepo)
	homeContentService := service.NewHomeContentService(homeContentRepo)
	travelPlaceService := service.NewTravelPlaceService(travelPlaceRepo)
	visitRecordService := service.NewVisitRecordService(visitRecordRepo, articleRepo)
	apiKeyService := service.NewAPIKeyService(apiKeyRepo, userRepo)
	pluginRepo := repository.NewPluginRepository(database.DB)
	pluginService := service.NewPluginService(pluginRepo, "plugin-storage")
	if err := pluginService.EnsureBuiltins("builtin-plugins"); err != nil {
		log.Logger.Error("初始化内置插件失败", "error", err)
		panic(err)
	}
	if err := authService.EnsureAdminAccount(
		os.Getenv("LOCAL_ADMIN_NAME"),
		os.Getenv("LOCAL_ADMIN_PASSWORD"),
	); err != nil {
		log.Logger.Error("初始化本地管理员账号失败", "error", err)
		panic(err)
	}
	if err := authService.EnsureAgentAccount(
		os.Getenv("LOCAL_AGENT_NAME"),
		os.Getenv("LOCAL_AGENT_PASSWORD"),
	); err != nil {
		log.Logger.Error("初始化本地Agent账号失败", "error", err)
		panic(err)
	}

	router := router.NewRouter(router.Dependencies{
		Articles:     handler.NewArticleHandler(articleService, authService),
		HomeContent:  handler.NewHomeContentHandler(homeContentService),
		TravelPlaces: handler.NewTravelPlaceHandler(travelPlaceService),
		Auth:         handler.NewAuthHandler(authService),
		Counters:     handler.NewCounterHandler(visitRecordService),
		VisitRecords: handler.NewVisitRecordHandler(visitRecordService),
		APIKeys:      handler.NewAPIKeyHandler(apiKeyService, authService),
		Uploads:      handler.NewUploadHandler(),
		Plugins:      handler.NewPluginHandler(pluginService),
		AuthorTokens: middleware.RequireRole(tokenManager, apiKeyService, "admin", "agent"),
		AuthTokens:   middleware.RequireRole(tokenManager, apiKeyService),
		AdminTokens:  middleware.RequireRole(tokenManager, apiKeyService, "admin"),
	})

	server := &http.Server{Addr: cfg.Server.ServeAddr(), Handler: router, ReadHeaderTimeout: 5 * time.Second, ReadTimeout: 10 * time.Second, WriteTimeout: 15 * time.Second, IdleTimeout: 60 * time.Second, MaxHeaderBytes: 16 << 10}
	go func() {
		if e := server.ListenAndServe(); e != nil && !errors.Is(e, http.ErrServerClosed) {
			log.Logger.Error("HTTP server failed", "error", e)
			stop()
		}
	}()
	<-ctx.Done()
	shutdown, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	_ = server.Shutdown(shutdown)
	if service.Visits != nil {
		service.Visits.Wait()
	}
	<-syncDone
}

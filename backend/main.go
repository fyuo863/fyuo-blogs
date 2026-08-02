package main

import (
	"context"
	"myblog/internal/auth"
	"myblog/internal/config"
	"myblog/internal/database"
	"myblog/internal/handler"
	"myblog/internal/middleware"
	"myblog/internal/repository"
	"myblog/internal/router"
	"myblog/internal/service"
	"myblog/log"
	"os"
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
	go service.StartSyncScheduler(context.Background())

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
	visitRecordRepo := repository.NewVisitRecordRepository(database.DB)
	apiKeyRepo := repository.NewAPIKeyRepository(database.DB)
	authService := service.NewAuthService(userRepo, tokenManager)
	articleService := service.NewArticleService(articleRepo)
	homeContentService := service.NewHomeContentService(homeContentRepo)
	visitRecordService := service.NewVisitRecordService(visitRecordRepo, articleRepo)
	apiKeyService := service.NewAPIKeyService(apiKeyRepo, userRepo)
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
		Auth:         handler.NewAuthHandler(authService),
		Counters:     handler.NewCounterHandler(visitRecordService),
		VisitRecords: handler.NewVisitRecordHandler(visitRecordService),
		APIKeys:      handler.NewAPIKeyHandler(apiKeyService, authService),
		Uploads:      handler.NewUploadHandler(),
		AuthorTokens: middleware.RequireRole(tokenManager, apiKeyService, "admin", "agent"),
		AuthTokens:   middleware.RequireRole(tokenManager, apiKeyService),
		AdminTokens:  middleware.RequireRole(tokenManager, apiKeyService, "admin"),
	})

	router.Run(cfg.Server.ServeAddr()) // listens on 0.0.0.0:8090 by default
}

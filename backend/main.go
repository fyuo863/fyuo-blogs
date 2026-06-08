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
	"time"
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
	authService := service.NewAuthService(userRepo, tokenManager)
	articleService := service.NewArticleService(articleRepo)

	router := router.NewRouter(router.Dependencies{
		Articles:   handler.NewArticleHandler(articleService, authService),
		Auth:       handler.NewAuthHandler(authService),
		AuthTokens: middleware.OptionalAuth(tokenManager),
	})

	router.Run(cfg.Server.ServeAddr()) // listens on 0.0.0.0:8090 by default
}

package main

import (
	"myblog/internal/config"
	"myblog/internal/database"
	"myblog/internal/router"
	"myblog/log"
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
	router := router.NewRouter()

	router.Run(cfg.Server.ServeAddr()) // listens on 0.0.0.0:8090 by default
}

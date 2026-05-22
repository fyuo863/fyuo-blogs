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
	err1 := database.InitRedis(&cfg.Redis)
	if err1 != nil {
		log.Logger.Error("Redis初始化失败", "error", err1)
		panic(err1)
	}
	defer database.CloseRedis()

	router := router.NewRouter()

	router.Run(cfg.Server.ServeAddr()) // listens on 0.0.0.0:8090 by default
}

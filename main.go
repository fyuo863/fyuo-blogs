package main

import (
	"myblog/internal/config"
	"myblog/internal/database"
	"myblog/internal/router"
)

func main() {
	cfg, err := config.Load("config.yaml")
	if err != nil {
		panic(err)
	}
	database.InitRedis(&cfg.Redis)
	defer database.CloseRedis()

	router := router.NewRouter()

	router.Run("127.0.0.1:8090") // listens on 0.0.0.0:8090 by default
}

package database

import (
	"myblog/internal/model"
	"myblog/log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

// InitPostgres 初始化 PostgreSQL 连接并自动建表
// func InitPostgres()

func InitPostgres(dsn string) error {
	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Logger.Error("连接 PostgreSQL 失败", "error", err)
		return err
	}

	// 自动迁移模式，生成真实的数据库表
	err = DB.AutoMigrate(
		&model.User{},
		&model.Article{},
		&model.Comment{},
	)
	if err != nil {
		log.Logger.Error("自动建表失败", "error", err)
		return err
	}

	log.Logger.Info("PostgreSQL 连接成功，数据库表同步完成！")
	return nil
}

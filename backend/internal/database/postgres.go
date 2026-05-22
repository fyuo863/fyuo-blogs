package database

import (
	"fmt"
	"myblog/internal/config"
	"myblog/internal/model"
	"myblog/log"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

// InitPostgres 初始化 PostgreSQL 连接并自动建表
func InitPostgres(cfg *config.DatabaseConfig) error {
	var err error

	// 1. 拼接 DSN (Data Source Name)
	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%d sslmode=%s TimeZone=%s",
		cfg.Host, cfg.User, cfg.Password, cfg.DBName, cfg.Port, cfg.SSLMode, cfg.TimeZone,
	)

	log.Logger.Info("正在连接 PostgreSQL...", "host", cfg.Host, "port", cfg.Port, "dbname", cfg.DBName)

	// 2. 连接数据库
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Logger.Error("连接 PostgreSQL 失败", "error", err)
		return fmt.Errorf("failed to connect to postgres: %w", err)
	}

	// 3. 配置底层连接池
	sqlDB, err := DB.DB()
	if err != nil {
		log.Logger.Error("获取底层 sql.DB 失败", "error", err)
		return fmt.Errorf("failed to get sql.DB: %w", err)
	}

	// 设置连接池参数
	sqlDB.SetMaxIdleConns(cfg.MaxIdleConns)
	sqlDB.SetMaxOpenConns(cfg.MaxOpenConns)
	sqlDB.SetConnMaxLifetime(time.Duration(cfg.ConnMaxLifetime) * time.Second)

	// 4. 自动同步表结构 (AutoMigrate)
	// 将我们之前定义的模型传给 AutoMigrate，它会自动在数据库中建表或更新字段
	err = DB.AutoMigrate(
		&model.User{},
		&model.Article{},
		&model.Comment{},
	)
	if err != nil {
		log.Logger.Error("自动同步表结构失败", "error", err)
		return fmt.Errorf("failed to auto migrate tables: %w", err)
	}

	log.Logger.Info("✅ PostgreSQL 初始化成功！连接池已配置，表结构已同步。")
	return nil
}

// ClosePostgres 关闭
func ClosePostgres() {
	if DB != nil {
		// 先获取底层的 *sql.DB 对象
		sqlDB, err := DB.DB()
		if err != nil {
			log.Logger.Error("[Postgres]", "获取底层数据库实例失败以执行关闭", err)
			return
		}

		// 执行关闭
		if err := sqlDB.Close(); err != nil {
			log.Logger.Error("[Postgres]", "关闭连接池时发生错误", err)
			return
		}
		log.Logger.Info("[Postgres] 连接池已正常关闭")
	}
}

func DBCreate(input interface{}) {
	// 2. 插入数据库
	result := DB.Create(input)
	if result.Error != nil {
		log.Logger.Info("创建文章", "失败", result.Error)
		return
	}
	log.Logger.Info("创建文章", "成功")
}

func DBRead(id uint) {
	var article model.Article

	// First 会根据主键查找第一条记录
	result := DB.First(&article, id)
	if result.Error != nil {
		log.Logger.Info("查询文章", "失败", result.Error)
		return
	}
	log.Logger.Info("查询文章成功!", "标题", article.Title)
}

func DBUpdate() {
}

func DBDelete(id uint) {
	// 物理删除这条记录
	DB.Delete(&model.Article{}, id)
	log.Logger.Info("文章已删除", "ID", id)
}

func AuthorCreate(name string) model.User {
	newUser := model.User{
		Name:         name,
		Role:         "admin",
		PasswordHash: "123456",
	}

	result := DB.Create(&newUser)
	if result.Error != nil {
		log.Logger.Error("创建用户", "失败:", result.Error)
		return model.User{} // 创建失败返回空用户对象
	}

	log.Logger.Info("创建用户", "成功!", "ID:", newUser.ID, "Name:", newUser.Name)

	// 返回数据库自动生成的新 ID
	return newUser
}

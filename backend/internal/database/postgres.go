package database

import (
	"errors"
	"fmt"
	"myblog/internal/config"
	"myblog/internal/model"
	"myblog/log"
	"time"

	"golang.org/x/crypto/bcrypt"
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
		&model.VisitRecord{},
		&model.APIKey{},
		&model.HomeContent{},
		&model.TravelPlace{},
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

// AuthorCreate 创建管理员账号（带密码加密）
func AuthorCreate(name string, plainPassword string) model.User {
	// 1. 核心修复：将明文密码转换为 bcrypt 哈希值
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(plainPassword), bcrypt.DefaultCost)
	if err != nil {
		log.Logger.Error("创建用户", "密码加密失败:", err)
		return model.User{}
	}

	// 2. 将加密后的乱码存入结构体
	newUser := model.User{
		Name:         name,
		Role:         "admin",
		PasswordHash: string(hashedPassword), // 这里存入的是类似 $2a$10$... 的密文
	}

	// 3. 写入数据库
	result := DB.Create(&newUser)
	if result.Error != nil {
		log.Logger.Error("创建用户", "失败:", result.Error)
		return model.User{}
	}

	log.Logger.Info("创建用户", "成功!", "ID:", newUser.ID, "Name:", newUser.Name)
	return newUser
}

// GetUserByName 根据用户名查询用户
func GetUserByName(name string) (model.User, error) {
	var user model.User

	// 使用 GORM 的 Where 和 First 方法查询一条记录
	result := DB.Where("name = ?", name).First(&user)

	// 错误处理逻辑
	if result.Error != nil {
		// 判断错误类型是否为“找不到记录”
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			log.Logger.Warn("查询用户", "未找到该账号:", name)
			return user, result.Error
		}

		// 其他数据库错误（如断连、表不存在等）
		log.Logger.Error("查询用户", "数据库查询失败:", result.Error)
		return user, result.Error
	}

	log.Logger.Info("查询用户", "成功!", "ID:", user.ID, "Name:", user.Name)

	// 返回查询到的真实用户数据和 nil 错误
	return user, nil
}

func DeleteUserByName(name string) error {
	// 注意：Delete 方法需要传入一个模型指针（这里传空指针 &User{} 即可），告诉 GORM 要操作哪张表
	result := DB.Where("name = ?", name).Delete(&model.User{})

	if result.Error != nil {
		log.Logger.Error("删除用户", "数据库执行失败:", result.Error)
		return result.Error
	}

	// RowsAffected 代表受影响的行数，如果是 0，说明数据库里根本没这个人
	if result.RowsAffected == 0 {
		log.Logger.Warn("删除用户", "未找到该用户，无需删除:", name)
		return nil
	}

	log.Logger.Info("删除用户", "成功彻底删除!", "Name:", name)
	return nil
}

package model

import (
	"time"

	"github.com/lib/pq" // 引入 pq 以支持 PostgreSQL 特有类型
)

// User 和 Comment 的定义与上面 MySQL 完全一致，这里省略...
type User struct {
	ID           uint      `gorm:"primaryKey" json:"id"`
	Role         string    `gorm:"type:varchar(20);default:'visitor'" json:"role"` // admin 或 visitor
	Name         string    `gorm:"type:varchar(100);uniqueIndex;not null" json:"name"`
	PasswordHash string    `gorm:"type:varchar(255);not null" json:"-"` // JSON 序列化时忽略密码
	CreatedAt    time.Time `json:"created_at"`

	// 关联：一个用户可以写多篇文章，发多个评论
	Articles []Article `gorm:"foreignKey:AuthorID" json:"articles,omitempty"`
	Comments []Comment `gorm:"foreignKey:UserID" json:"comments,omitempty"`
}

// Comment 评论表
type Comment struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	ArticleID uint      `json:"article_id"` // 外键：属于哪篇文章
	UserID    uint      `json:"user_id"`    // 外键：谁评论的
	Content   string    `gorm:"type:text;not null" json:"content"`
	CreatedAt time.Time `json:"created_at"`

	// 关联对象的预加载
	User User `gorm:"foreignKey:UserID" json:"user"`
}

// Article 文章表 (PostgreSQL 版本)
type Article struct {
	ID            uint      `gorm:"primaryKey" json:"id"`
	Title         string    `gorm:"type:varchar(255);not null" json:"title"`
	Content       string    `gorm:"type:text" json:"content"` // PG 中 text 可以存任意长度
	CoverImage    string    `gorm:"type:text" json:"cover_image"`
	Stage         string    `gorm:"type:varchar(20);default:'draft'" json:"stage"`
	Vol           int       `gorm:"type:int" json:"vol"`
	AuthorID      uint      `json:"author_id"`
	Author        User      `gorm:"foreignKey:AuthorID" json:"author"`
	PublisherName string    `gorm:"type:varchar(120)" json:"publisher_name"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`

	// 重点：直接使用 PostgreSQL 的文本数组类型
	// 数据库中只会存成一个字段，例如：{"Golang", "后端开发", "Redis"}
	Tags pq.StringArray `gorm:"type:text[]" json:"tags"`

	ViewCount int `gorm:"default:0" json:"view_count"`
	LikeCount int `gorm:"default:0" json:"like_count"`
}

type VisitRecord struct {
	ID           uint      `gorm:"primaryKey" json:"id"`
	VisitorID    string    `gorm:"type:varchar(80);index;not null" json:"visitor_id"`
	IPAddress    string    `gorm:"type:varchar(64);index" json:"ip_address"`
	City         string    `gorm:"type:varchar(120);index" json:"city"`
	ContentTitle string    `gorm:"type:varchar(255)" json:"content_title"`
	ArticleID    *uint     `gorm:"index" json:"article_id,omitempty"`
	CreatedAt    time.Time `gorm:"index" json:"created_at"`
}

type APIKey struct {
	ID         uint       `gorm:"primaryKey" json:"id"`
	Name       string     `gorm:"type:varchar(120);index;not null" json:"name"`
	KeyHash    string     `gorm:"type:char(64);uniqueIndex;not null" json:"-"`
	UserID     uint       `gorm:"index;not null" json:"user_id"`
	User       User       `gorm:"foreignKey:UserID" json:"user"`
	Enabled    bool       `gorm:"default:true;index" json:"enabled"`
	LastUsedAt *time.Time `json:"last_used_at,omitempty"`
	CreatedAt  time.Time  `json:"created_at"`
	UpdatedAt  time.Time  `json:"updated_at"`
}

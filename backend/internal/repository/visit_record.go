package repository

import (
	"context"
	"database/sql"
	"myblog/internal/model"
	"strings"
	"time"

	"gorm.io/gorm"
)

type VisitRecordRepository struct {
	db *gorm.DB
}

type VisitRecordFilter struct {
	Sort      string
	Page      int
	PageSize  int
	ArticleID uint
	Search    string
	From      time.Time
	Until     time.Time
}

type VisitRecordPage struct {
	Data         []model.VisitRecord `json:"data"`
	Total        int64               `json:"total"`
	BrowserCount int64               `json:"browser_count"`
	ArticleCount int64               `json:"article_count"`
	Page         int                 `json:"page"`
	PageSize     int                 `json:"page_size"`
	TotalPages   int                 `json:"total_pages"`
}

func NewVisitRecordRepository(db *gorm.DB) *VisitRecordRepository {
	return &VisitRecordRepository{db: db}
}

func (r *VisitRecordRepository) Create(record *model.VisitRecord) error {
	return r.db.Create(record).Error
}

func (r *VisitRecordRepository) List(ctx context.Context, filter VisitRecordFilter) (VisitRecordPage, error) {
	result := VisitRecordPage{Data: []model.VisitRecord{}, Page: filter.Page, PageSize: filter.PageSize}
	// Counts and rows use one snapshot even while new visits arrive.
	err := r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		query := tx.Model(&model.VisitRecord{})
		if filter.ArticleID != 0 {
			query = query.Where("article_id = ?", filter.ArticleID)
		}
		if !filter.From.IsZero() {
			query = query.Where("created_at >= ?", filter.From)
		}
		if !filter.Until.IsZero() {
			query = query.Where("created_at < ?", filter.Until)
		}
		if filter.Search != "" {
			pattern := "%" + strings.NewReplacer("\\", "\\\\", "%", "\\%", "_", "\\_").Replace(filter.Search) + "%"
			query = query.Where("(content_title ILIKE ? OR ip_address ILIKE ? OR visitor_id ILIKE ?)", pattern, pattern, pattern)
		}
		var counts struct {
			Total, BrowserCount, ArticleCount int64
		}
		if err := query.Session(&gorm.Session{}).Select("count(*) AS total, count(DISTINCT NULLIF(visitor_id, '')) AS browser_count, count(DISTINCT article_id) AS article_count").Scan(&counts).Error; err != nil {
			return err
		}
		result.Total, result.BrowserCount, result.ArticleCount = counts.Total, counts.BrowserCount, counts.ArticleCount
		result.TotalPages = int((result.Total + int64(filter.PageSize) - 1) / int64(filter.PageSize))
		if result.TotalPages > 0 && result.Page > result.TotalPages {
			result.Page = result.TotalPages
		}
		if result.TotalPages == 0 {
			result.Page = 1
		}
		order := "created_at DESC, id DESC"
		if filter.Sort == "oldest" {
			order = "created_at ASC, id ASC"
		}
		return query.Order(order).Limit(filter.PageSize).Offset((result.Page - 1) * filter.PageSize).Find(&result.Data).Error
	}, &sql.TxOptions{Isolation: sql.LevelRepeatableRead, ReadOnly: true})
	return result, err
}

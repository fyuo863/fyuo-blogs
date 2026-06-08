package repository

import (
	"myblog/internal/model"

	"github.com/lib/pq"
	"gorm.io/gorm"
)

type ArticleRepository struct {
	db *gorm.DB
}

type ArticleUpdate struct {
	Title   *string
	Content *string
	Stage   *string
	Vol     *int
	Tags    []string
}

func NewArticleRepository(db *gorm.DB) *ArticleRepository {
	return &ArticleRepository{db: db}
}

func (r *ArticleRepository) Create(article *model.Article) error {
	return r.db.Create(article).Error
}

func (r *ArticleRepository) CountVisible() (int64, error) {
	var total int64
	err := r.db.Model(&model.Article{}).Where("stage != ?", "hidden").Count(&total).Error
	return total, err
}

func (r *ArticleRepository) ListVisible(page, pageSize int) ([]model.Article, int64, error) {
	if page < 1 {
		page = 1
	}
	if pageSize < 1 {
		pageSize = 10
	}
	offset := (page - 1) * pageSize

	total, err := r.CountVisible()
	if err != nil {
		return nil, 0, err
	}

	var articles []model.Article
	err = r.db.Where("stage != ?", "hidden").
		Order("created_at DESC").
		Offset(offset).
		Limit(pageSize).
		Find(&articles).Error
	return articles, total, err
}

func (r *ArticleRepository) SearchVisible(query string, limit int) ([]model.Article, error) {
	if limit < 1 {
		limit = 20
	}
	like := "%" + query + "%"
	var articles []model.Article
	err := r.db.Where("stage != ?", "hidden").
		Where("title ILIKE ? OR content ILIKE ?", like, like).
		Order("created_at DESC").
		Limit(limit).
		Find(&articles).Error
	return articles, err
}

func (r *ArticleRepository) GetVisible(id uint) (model.Article, error) {
	var article model.Article
	err := r.db.Where("stage != ?", "hidden").First(&article, id).Error
	return article, err
}

func (r *ArticleRepository) GetByID(id uint) (model.Article, error) {
	var article model.Article
	err := r.db.First(&article, id).Error
	return article, err
}

func (r *ArticleRepository) Update(id uint, update ArticleUpdate) (model.Article, error) {
	article, err := r.GetByID(id)
	if err != nil {
		return article, err
	}

	updates := map[string]interface{}{}
	if update.Title != nil {
		updates["title"] = *update.Title
	}
	if update.Content != nil {
		updates["content"] = *update.Content
	}
	if update.Stage != nil {
		updates["stage"] = *update.Stage
	}
	if update.Vol != nil {
		updates["vol"] = *update.Vol
	}
	if update.Tags != nil {
		updates["tags"] = pq.StringArray(update.Tags)
	}
	if len(updates) == 0 {
		return article, gorm.ErrInvalidData
	}

	if err := r.db.Model(&article).Updates(updates).Error; err != nil {
		return article, err
	}
	return r.GetByID(id)
}

func (r *ArticleRepository) SoftDelete(id uint) (bool, error) {
	result := r.db.Model(&model.Article{}).Where("id = ?", id).Update("stage", "hidden")
	if result.Error != nil {
		return false, result.Error
	}
	return result.RowsAffected > 0, nil
}

func (r *ArticleRepository) IncrementView(id uint) error {
	return r.db.Model(&model.Article{}).
		Where("id = ?", id).
		Update("view_count", gorm.Expr("view_count + 1")).Error
}

func (r *ArticleRepository) IncrementLike(id uint, delta int) error {
	return r.db.Model(&model.Article{}).
		Where("id = ?", id).
		Update("like_count", gorm.Expr("GREATEST(like_count + ?, 0)", delta)).Error
}

package repository

import (
	"myblog/internal/model"

	"gorm.io/gorm"
)

type HomeContentRepository struct {
	db *gorm.DB
}

func NewHomeContentRepository(db *gorm.DB) *HomeContentRepository {
	return &HomeContentRepository{db: db}
}

func (r *HomeContentRepository) Get() (model.HomeContent, error) {
	var content model.HomeContent
	err := r.db.First(&content, 1).Error
	return content, err
}

func (r *HomeContentRepository) Save(content *model.HomeContent) error {
	content.ID = 1
	return r.db.Save(content).Error
}

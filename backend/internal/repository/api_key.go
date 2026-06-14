package repository

import (
	"myblog/internal/model"
	"time"

	"gorm.io/gorm"
)

type APIKeyRepository struct {
	db *gorm.DB
}

func NewAPIKeyRepository(db *gorm.DB) *APIKeyRepository {
	return &APIKeyRepository{db: db}
}

func (r *APIKeyRepository) Create(key *model.APIKey) error {
	return r.db.Create(key).Error
}

func (r *APIKeyRepository) List() ([]model.APIKey, error) {
	var keys []model.APIKey
	err := r.db.Preload("User").Order("created_at DESC").Find(&keys).Error
	return keys, err
}

func (r *APIKeyRepository) FindByID(id uint) (model.APIKey, error) {
	var key model.APIKey
	err := r.db.Preload("User").First(&key, id).Error
	return key, err
}

func (r *APIKeyRepository) FindByHash(hash string) (model.APIKey, error) {
	var key model.APIKey
	err := r.db.Preload("User").Where("key_hash = ? AND enabled = ?", hash, true).First(&key).Error
	return key, err
}

func (r *APIKeyRepository) Save(key *model.APIKey) error {
	return r.db.Save(key).Error
}

func (r *APIKeyRepository) Delete(id uint) error {
	return r.db.Delete(&model.APIKey{}, id).Error
}

func (r *APIKeyRepository) TouchLastUsed(id uint, usedAt time.Time) error {
	return r.db.Model(&model.APIKey{}).Where("id = ?", id).Update("last_used_at", usedAt).Error
}

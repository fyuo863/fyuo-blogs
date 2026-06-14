package repository

import (
	"myblog/internal/model"
	"strings"

	"gorm.io/gorm"
)

type VisitRecordRepository struct {
	db *gorm.DB
}

type VisitRecordFilter struct {
	Sort string
}

func NewVisitRecordRepository(db *gorm.DB) *VisitRecordRepository {
	return &VisitRecordRepository{db: db}
}

func (r *VisitRecordRepository) Create(record *model.VisitRecord) error {
	return r.db.Create(record).Error
}

func (r *VisitRecordRepository) List(filter VisitRecordFilter) ([]model.VisitRecord, error) {
	query := r.db.Model(&model.VisitRecord{})

	switch strings.ToLower(filter.Sort) {
	case "oldest":
		query = query.Order("created_at ASC")
	default:
		query = query.Order("created_at DESC")
	}

	var records []model.VisitRecord
	err := query.Limit(200).Find(&records).Error
	return records, err
}

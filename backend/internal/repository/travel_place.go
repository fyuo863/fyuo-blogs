package repository

import (
	"myblog/internal/model"

	"gorm.io/gorm"
)

type TravelPlaceRepository struct {
	db *gorm.DB
}

func NewTravelPlaceRepository(db *gorm.DB) *TravelPlaceRepository {
	return &TravelPlaceRepository{db: db}
}

func (r *TravelPlaceRepository) List() ([]model.TravelPlace, error) {
	var places []model.TravelPlace
	err := r.db.Preload("Author").Order("created_at DESC").Find(&places).Error
	return places, err
}

func (r *TravelPlaceRepository) FindByID(id uint) (model.TravelPlace, error) {
	var place model.TravelPlace
	err := r.db.Preload("Author").First(&place, id).Error
	return place, err
}

func (r *TravelPlaceRepository) Create(place *model.TravelPlace) error {
	return r.db.Create(place).Error
}

func (r *TravelPlaceRepository) Save(place *model.TravelPlace) error {
	return r.db.Save(place).Error
}

func (r *TravelPlaceRepository) Delete(id uint) error {
	return r.db.Delete(&model.TravelPlace{}, id).Error
}

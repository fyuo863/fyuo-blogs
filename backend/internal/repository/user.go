package repository

import (
	"myblog/internal/model"

	"gorm.io/gorm"
)

type UserRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) *UserRepository {
	return &UserRepository{db: db}
}

func (r *UserRepository) FindByName(name string) (model.User, error) {
	var user model.User
	err := r.db.Where("name = ?", name).First(&user).Error
	return user, err
}

func (r *UserRepository) FindByID(id uint) (model.User, error) {
	var user model.User
	err := r.db.First(&user, id).Error
	return user, err
}

func (r *UserRepository) Save(user *model.User) error {
	return r.db.Save(user).Error
}

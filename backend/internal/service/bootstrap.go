package service

import (
	"errors"
	"myblog/internal/model"
	"myblog/log"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func (s *AuthService) EnsureAdminAccount(name, password string) error {
	if name == "" || password == "" {
		return nil
	}

	user, err := s.users.FindByName(name)
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return err
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	if errors.Is(err, gorm.ErrRecordNotFound) {
		user = model.User{
			Name:         name,
			Role:         "admin",
			PasswordHash: string(hash),
		}
		if err := s.users.Save(&user); err != nil {
			return err
		}
		log.Logger.Info("本地管理员账号已创建", "name", name)
		return nil
	}

	user.Role = "admin"
	user.PasswordHash = string(hash)
	if err := s.users.Save(&user); err != nil {
		return err
	}
	log.Logger.Info("本地管理员账号已刷新", "name", name)
	return nil
}

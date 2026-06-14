package service

import (
	"errors"
	"myblog/internal/model"
	"myblog/log"
	"os"
	"strings"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func (s *AuthService) EnsureAdminAccount(name, password string) error {
	if !seedEnabled("ENABLE_ADMIN_ACCOUNT_SEED") {
		return nil
	}
	return s.ensureAccount(name, password, "admin", "本地管理员账号")
}

func (s *AuthService) EnsureAgentAccount(name, password string) error {
	if !seedEnabled("ENABLE_AGENT_ACCOUNT_SEED") {
		return nil
	}
	return s.ensureAccount(name, password, "agent", "本地Agent账号")
}

func (s *AuthService) ensureAccount(name, password, role, label string) error {
	name = strings.TrimSpace(name)
	password = strings.TrimSpace(password)
	role = strings.TrimSpace(role)
	if name == "" || password == "" || role == "" {
		log.Logger.Warn(label+"已跳过", "reason", "empty seed fields", "name", name, "role", role)
		return nil
	}

	user, err := s.users.FindByName(name)
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return err
	}
	notFound := errors.Is(err, gorm.ErrRecordNotFound)

	hash, hashErr := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if hashErr != nil {
		return hashErr
	}

	if notFound {
		user = model.User{
			Name:         name,
			Role:         role,
			PasswordHash: string(hash),
		}
		if err := s.users.Create(&user); err != nil {
			return err
		}
		log.Logger.Info(label+"已创建", "name", name, "role", role)
		return nil
	}

	user.Role = role
	user.PasswordHash = string(hash)
	if err := s.users.Save(&user); err != nil {
		return err
	}
	log.Logger.Info(label+"已刷新", "name", name, "role", role)
	return nil
}

func seedEnabled(envKey string) bool {
	value := strings.TrimSpace(strings.ToLower(os.Getenv(envKey)))
	return value == "1" || value == "true" || value == "yes" || value == "on"
}

package service

import (
	"context"
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"fmt"
	"myblog/internal/model"
	"myblog/internal/repository"
	"strings"
	"time"

	"gorm.io/gorm"
)

var (
	ErrAPIKeyNotFound     = errors.New("api key not found")
	ErrAPIKeyAdminOnly    = errors.New("api key admin only")
	ErrAPIKeyInvalidInput = errors.New("api key invalid input")
)

type APIKeyService struct {
	keys  *repository.APIKeyRepository
	users *repository.UserRepository
}

type APIKeyView struct {
	ID         uint       `json:"id"`
	Name       string     `json:"name"`
	UserID     uint       `json:"user_id"`
	UserName   string     `json:"user_name"`
	UserRole   string     `json:"user_role"`
	Enabled    bool       `json:"enabled"`
	LastUsedAt *time.Time `json:"last_used_at,omitempty"`
	CreatedAt  time.Time  `json:"created_at"`
	UpdatedAt  time.Time  `json:"updated_at"`
}

type APIKeyCreateInput struct {
	Name   string
	UserID uint
}

type APIKeyUpdateInput struct {
	Name    *string
	Enabled *bool
	UserID  *uint
}

func NewAPIKeyService(keys *repository.APIKeyRepository, users *repository.UserRepository) *APIKeyService {
	return &APIKeyService{keys: keys, users: users}
}

func (s *APIKeyService) List(ctx context.Context, actor model.User) ([]APIKeyView, error) {
	if actor.Role != "admin" {
		return nil, ErrAPIKeyAdminOnly
	}
	items, err := s.keys.List()
	if err != nil {
		return nil, err
	}
	result := make([]APIKeyView, 0, len(items))
	for _, item := range items {
		result = append(result, toAPIKeyView(item))
	}
	return result, nil
}

func (s *APIKeyService) Create(ctx context.Context, actor model.User, input APIKeyCreateInput) (APIKeyView, string, error) {
	if actor.Role != "admin" {
		return APIKeyView{}, "", ErrAPIKeyAdminOnly
	}
	input.Name = strings.TrimSpace(input.Name)
	if input.Name == "" || input.UserID == 0 {
		return APIKeyView{}, "", ErrAPIKeyInvalidInput
	}
	user, err := s.users.FindByID(input.UserID)
	if err != nil {
		return APIKeyView{}, "", err
	}

	plain, hash, err := generateAPIKey()
	if err != nil {
		return APIKeyView{}, "", err
	}
	key := model.APIKey{
		Name:    input.Name,
		KeyHash: hash,
		UserID:  user.ID,
		Enabled: true,
	}
	if err := s.keys.Create(&key); err != nil {
		return APIKeyView{}, "", err
	}
	key.User = user
	return toAPIKeyView(key), plain, nil
}

func (s *APIKeyService) Update(ctx context.Context, actor model.User, id uint, input APIKeyUpdateInput) (APIKeyView, error) {
	if actor.Role != "admin" {
		return APIKeyView{}, ErrAPIKeyAdminOnly
	}
	key, err := s.keys.FindByID(id)
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return APIKeyView{}, ErrAPIKeyNotFound
	}
	if err != nil {
		return APIKeyView{}, err
	}
	if input.Name != nil {
		name := strings.TrimSpace(*input.Name)
		if name == "" {
			return APIKeyView{}, ErrAPIKeyInvalidInput
		}
		key.Name = name
	}
	if input.Enabled != nil {
		key.Enabled = *input.Enabled
	}
	if input.UserID != nil {
		if *input.UserID == 0 {
			return APIKeyView{}, ErrAPIKeyInvalidInput
		}
		user, err := s.users.FindByID(*input.UserID)
		if err != nil {
			return APIKeyView{}, err
		}
		key.UserID = user.ID
		key.User = user
	}
	if err := s.keys.Save(&key); err != nil {
		return APIKeyView{}, err
	}
	return toAPIKeyView(key), nil
}

func (s *APIKeyService) Rotate(ctx context.Context, actor model.User, id uint) (APIKeyView, string, error) {
	if actor.Role != "admin" {
		return APIKeyView{}, "", ErrAPIKeyAdminOnly
	}
	key, err := s.keys.FindByID(id)
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return APIKeyView{}, "", ErrAPIKeyNotFound
	}
	if err != nil {
		return APIKeyView{}, "", err
	}
	plain, hash, err := generateAPIKey()
	if err != nil {
		return APIKeyView{}, "", err
	}
	key.KeyHash = hash
	key.Enabled = true
	key.LastUsedAt = nil
	if err := s.keys.Save(&key); err != nil {
		return APIKeyView{}, "", err
	}
	return toAPIKeyView(key), plain, nil
}

func (s *APIKeyService) Delete(ctx context.Context, actor model.User, id uint) error {
	if actor.Role != "admin" {
		return ErrAPIKeyAdminOnly
	}
	key, err := s.keys.FindByID(id)
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return ErrAPIKeyNotFound
	}
	if err != nil {
		return err
	}
	return s.keys.Delete(key.ID)
}

func (s *APIKeyService) Authenticate(raw string) (model.User, error) {
	hash := hashAPIKey(raw)
	key, err := s.keys.FindByHash(hash)
	if err != nil {
		return model.User{}, err
	}
	_ = s.keys.TouchLastUsed(key.ID, time.Now())
	return key.User, nil
}

func (s *APIKeyService) Resolve(raw string) (model.User, string, error) {
	hash := hashAPIKey(raw)
	key, err := s.keys.FindByHash(hash)
	if err != nil {
		return model.User{}, "", err
	}
	_ = s.keys.TouchLastUsed(key.ID, time.Now())
	return key.User, key.Name, nil
}

func toAPIKeyView(key model.APIKey) APIKeyView {
	return APIKeyView{
		ID:         key.ID,
		Name:       key.Name,
		UserID:     key.UserID,
		UserName:   key.User.Name,
		UserRole:   key.User.Role,
		Enabled:    key.Enabled,
		LastUsedAt: key.LastUsedAt,
		CreatedAt:  key.CreatedAt,
		UpdatedAt:  key.UpdatedAt,
	}
}

func generateAPIKey() (string, string, error) {
	buf := make([]byte, 24)
	if _, err := rand.Read(buf); err != nil {
		return "", "", err
	}
	token := "blogak_" + hex.EncodeToString(buf)
	return token, hashAPIKey(token), nil
}

func hashAPIKey(raw string) string {
	sum := sha256.Sum256([]byte(strings.TrimSpace(raw)))
	return hex.EncodeToString(sum[:])
}

func (s *APIKeyService) EnsureLocalAgentKey(name string, userName string) (string, error) {
	name = strings.TrimSpace(name)
	userName = strings.TrimSpace(userName)
	if name == "" || userName == "" {
		return "", nil
	}
	user, err := s.users.FindByName(userName)
	if err != nil {
		return "", err
	}
	keyName := fmt.Sprintf("%s-local", name)
	items, err := s.keys.List()
	if err != nil {
		return "", err
	}
	for _, item := range items {
		if item.Name == keyName && item.UserID == user.ID {
			return "", nil
		}
	}
	view, plain, err := s.Create(context.Background(), model.User{Role: "admin"}, APIKeyCreateInput{
		Name:   keyName,
		UserID: user.ID,
	})
	if err != nil {
		return "", err
	}
	_ = view
	return plain, nil
}

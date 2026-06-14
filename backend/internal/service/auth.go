package service

import (
	"errors"
	"myblog/internal/auth"
	"myblog/internal/model"
	"myblog/internal/repository"

	"golang.org/x/crypto/bcrypt"
)

var ErrInvalidCredentials = errors.New("invalid credentials")

type AuthService struct {
	users  *repository.UserRepository
	tokens *auth.TokenManager
}

type LoginResult struct {
	User  model.User
	Token string
}

func NewAuthService(users *repository.UserRepository, tokens *auth.TokenManager) *AuthService {
	return &AuthService{users: users, tokens: tokens}
}

func (s *AuthService) Authenticate(name, password string) (LoginResult, error) {
	user, err := s.users.FindByName(name)
	if err != nil {
		return LoginResult{}, ErrInvalidCredentials
	}
	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password)); err != nil {
		return LoginResult{}, ErrInvalidCredentials
	}
	token, err := s.tokens.Generate(user)
	if err != nil {
		return LoginResult{}, err
	}
	return LoginResult{User: user, Token: token}, nil
}

func (s *AuthService) UserFromClaims(claims auth.Claims) model.User {
	return model.User{
		ID:   claims.UserID,
		Name: claims.Name,
		Role: claims.Role,
	}
}

func (s *AuthService) PublisherNameFromClaims(claims auth.Claims) string {
	if claims.PublisherName != "" {
		return claims.PublisherName
	}
	return claims.Name
}

func (s *AuthService) ListPrivilegedUsers() ([]model.User, error) {
	return s.users.ListPrivileged()
}

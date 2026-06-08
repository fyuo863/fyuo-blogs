package auth

import (
	"errors"
	"myblog/internal/model"
	"testing"
	"time"
)

func TestTokenManagerGenerateVerify(t *testing.T) {
	manager := NewTokenManager("test-secret", time.Hour)
	token, err := manager.Generate(model.User{ID: 7, Name: "admin", Role: "admin"})
	if err != nil {
		t.Fatalf("Generate() error = %v", err)
	}

	claims, err := manager.Verify(token)
	if err != nil {
		t.Fatalf("Verify() error = %v", err)
	}
	if claims.UserID != 7 || claims.Name != "admin" || claims.Role != "admin" {
		t.Fatalf("claims = %+v", claims)
	}
}

func TestTokenManagerRejectsTamperedToken(t *testing.T) {
	manager := NewTokenManager("test-secret", time.Hour)
	token, err := manager.Generate(model.User{ID: 7, Name: "admin", Role: "admin"})
	if err != nil {
		t.Fatalf("Generate() error = %v", err)
	}

	_, err = manager.Verify(token + "x")
	if !errors.Is(err, ErrInvalidToken) {
		t.Fatalf("Verify() error = %v, want ErrInvalidToken", err)
	}
}

func TestTokenManagerRejectsExpiredToken(t *testing.T) {
	manager := NewTokenManager("test-secret", -time.Hour)
	token, err := manager.Generate(model.User{ID: 7, Name: "admin", Role: "admin"})
	if err != nil {
		t.Fatalf("Generate() error = %v", err)
	}

	_, err = manager.Verify(token)
	if !errors.Is(err, ErrExpiredToken) {
		t.Fatalf("Verify() error = %v, want ErrExpiredToken", err)
	}
}

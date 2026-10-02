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

func TestRevocationAndAccountChanges(t *testing.T) {
	m := NewTokenManager("test", time.Hour)
	u := model.User{ID: 1, Name: "admin", Role: "admin", PasswordHash: "hash"}
	sessions := map[string]Session{}
	m.ResolveUser = func(uint) (model.User, error) { return u, nil }
	m.SaveSession = func(s Session) error { sessions[s.ID] = s; return nil }
	m.SessionExists = func(id string, uid uint) (bool, error) { s, ok := sessions[id]; return ok && s.UserID == uid, nil }
	m.DeleteSession = func(id string) error { delete(sessions, id); return nil }
	token, _ := m.Generate(u)
	if _, e := m.Verify(token); e != nil {
		t.Fatal(e)
	}
	if e := m.Revoke(token); e != nil {
		t.Fatal(e)
	}
	if _, e := m.Verify(token); e == nil {
		t.Fatal("revoked token accepted")
	}
	token, _ = m.Generate(u)
	u.Role = "agent"
	if _, e := m.Verify(token); e == nil {
		t.Fatal("stale role accepted")
	}
	token, _ = m.Generate(u)
	u.PasswordHash = "new"
	if _, e := m.Verify(token); e == nil {
		t.Fatal("stale password accepted")
	}
}

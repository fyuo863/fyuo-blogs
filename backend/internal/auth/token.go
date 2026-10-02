package auth

import (
	"crypto/hmac"
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"myblog/internal/model"
	"strings"
	"time"
)

var (
	ErrInvalidToken = errors.New("invalid token")
	ErrExpiredToken = errors.New("expired token")
)

type Claims struct {
	UserID        uint   `json:"uid"`
	Name          string `json:"name"`
	Role          string `json:"role"`
	PublisherName string `json:"publisher_name,omitempty"`
	SessionID     string `json:"sid,omitempty"`
	UserStamp     string `json:"stamp,omitempty"`
	Exp           int64  `json:"exp"`
}

type TokenManager struct {
	secret        []byte
	ttl           time.Duration
	ResolveUser   func(uint) (model.User, error)
	SaveSession   func(Session) error
	SessionExists func(string, uint) (bool, error)
	DeleteSession func(string) error
}

func NewTokenManager(secret string, ttl time.Duration) *TokenManager {
	return &TokenManager{
		secret: []byte(secret),
		ttl:    ttl,
	}
}

type Session struct {
	ID        string    `gorm:"primaryKey;size:64"`
	UserID    uint      `gorm:"index"`
	ExpiresAt time.Time `gorm:"index"`
}

func (m *TokenManager) Generate(user model.User) (string, error) {
	nonce := make([]byte, 32)
	if _, err := rand.Read(nonce); err != nil {
		return "", err
	}
	claims := Claims{
		SessionID:     base64.RawURLEncoding.EncodeToString(nonce),
		UserStamp:     m.sign(user.PasswordHash),
		UserID:        user.ID,
		Name:          user.Name,
		Role:          user.Role,
		PublisherName: user.Name,
		Exp:           time.Now().Add(m.ttl).Unix(),
	}
	if m.SaveSession != nil {
		if err := m.SaveSession(Session{ID: claims.SessionID, UserID: user.ID, ExpiresAt: time.Unix(claims.Exp, 0)}); err != nil {
			return "", err
		}
	}
	payload, err := json.Marshal(claims)
	if err != nil {
		return "", err
	}
	body := base64.RawURLEncoding.EncodeToString(payload)
	sig := m.sign(body)
	return body + "." + sig, nil
}

func (m *TokenManager) Verify(token string) (Claims, error) {
	var claims Claims
	parts := strings.Split(token, ".")
	if len(parts) != 2 || parts[0] == "" || parts[1] == "" {
		return claims, ErrInvalidToken
	}
	expected := m.sign(parts[0])
	if !hmac.Equal([]byte(expected), []byte(parts[1])) {
		return claims, ErrInvalidToken
	}
	payload, err := base64.RawURLEncoding.DecodeString(parts[0])
	if err != nil {
		return claims, ErrInvalidToken
	}
	if err := json.Unmarshal(payload, &claims); err != nil {
		return claims, ErrInvalidToken
	}
	if claims.Exp <= time.Now().Unix() {
		return claims, ErrExpiredToken
	}
	if m.ResolveUser != nil {
		u, err := m.ResolveUser(claims.UserID)
		if err != nil || u.Name != claims.Name || u.Role != claims.Role || !hmac.Equal([]byte(claims.UserStamp), []byte(m.sign(u.PasswordHash))) {
			return Claims{}, ErrInvalidToken
		}
	}
	if m.SessionExists != nil {
		ok, err := m.SessionExists(claims.SessionID, claims.UserID)
		if err != nil || !ok {
			return Claims{}, ErrInvalidToken
		}
	}
	return claims, nil
}

func (m *TokenManager) sign(body string) string {
	mac := hmac.New(sha256.New, m.secret)
	mac.Write([]byte(body))
	return base64.RawURLEncoding.EncodeToString(mac.Sum(nil))
}

func BearerToken(header string) (string, error) {
	const prefix = "Bearer "
	if !strings.HasPrefix(header, prefix) {
		return "", fmt.Errorf("%w: missing bearer prefix", ErrInvalidToken)
	}
	token := strings.TrimSpace(strings.TrimPrefix(header, prefix))
	if token == "" {
		return "", ErrInvalidToken
	}
	return token, nil
}

func (m *TokenManager) Revoke(token string) error {
	claims, err := m.Verify(token)
	if err != nil {
		return err
	}
	if m.DeleteSession == nil {
		return ErrInvalidToken
	}
	return m.DeleteSession(claims.SessionID)
}

package middleware

import (
	"errors"
	"myblog/internal/auth"
	"myblog/internal/model"
	"myblog/internal/service"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

const AuthClaimsKey = "auth.claims"

func OptionalAuth(tokens *auth.TokenManager) gin.HandlerFunc {
	return func(c *gin.Context) {
		header := c.GetHeader("Authorization")
		if header == "" {
			c.Next()
			return
		}

		token, err := auth.BearerToken(header)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "无效的认证信息"})
			c.Abort()
			return
		}
		claims, err := tokens.Verify(token)
		if err != nil {
			status := http.StatusUnauthorized
			msg := "无效的认证信息"
			if errors.Is(err, auth.ErrExpiredToken) {
				msg = "登录已过期，请重新登录"
			}
			c.JSON(status, gin.H{"error": msg})
			c.Abort()
			return
		}
		c.Set(AuthClaimsKey, claims)
		c.Next()
	}
}

func RequireRole(tokens *auth.TokenManager, apiKeys *service.APIKeyService, allowedRoles ...string) gin.HandlerFunc {
	allowed := map[string]struct{}{}
	for _, role := range allowedRoles {
		allowed[role] = struct{}{}
	}

	return func(c *gin.Context) {
		claims, err := authenticateRequest(c, tokens, apiKeys)
		if err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				c.JSON(http.StatusUnauthorized, gin.H{"error": "无效的 API Key"})
				c.Abort()
				return
			}
			if errors.Is(err, auth.ErrExpiredToken) {
				c.JSON(http.StatusUnauthorized, gin.H{"error": "登录已过期，请重新登录"})
				c.Abort()
				return
			}
			if errors.Is(err, auth.ErrInvalidToken) {
				c.JSON(http.StatusUnauthorized, gin.H{"error": "无效的认证信息"})
				c.Abort()
				return
			}
			c.JSON(http.StatusUnauthorized, gin.H{"error": "请先登录"})
			c.Abort()
			return
		}
		if len(allowed) > 0 {
			if _, ok := allowed[claims.Role]; !ok {
				c.JSON(http.StatusForbidden, gin.H{"error": "权限不足"})
				c.Abort()
				return
			}
		}
		c.Set(AuthClaimsKey, claims)
		c.Next()
	}
}

func Claims(c *gin.Context) (auth.Claims, bool) {
	value, ok := c.Get(AuthClaimsKey)
	if !ok {
		return auth.Claims{}, false
	}
	claims, ok := value.(auth.Claims)
	return claims, ok
}

func authenticateRequest(c *gin.Context, tokens *auth.TokenManager, apiKeys *service.APIKeyService) (auth.Claims, error) {
	header := strings.TrimSpace(c.GetHeader("Authorization"))
	if header != "" {
		token, err := auth.BearerToken(header)
		if err != nil {
			return auth.Claims{}, err
		}
		return tokens.Verify(token)
	}

	rawKey := strings.TrimSpace(c.GetHeader("X-API-Key"))
	if rawKey == "" || apiKeys == nil {
		return auth.Claims{}, errors.New("missing credentials")
	}
	user, publisherName, err := apiKeys.Resolve(rawKey)
	if err != nil {
		return auth.Claims{}, err
	}
	claims := claimsFromUser(user)
	if publisherName != "" {
		claims.PublisherName = publisherName
	}
	return claims, nil
}

func claimsFromUser(user model.User) auth.Claims {
	return auth.Claims{
		UserID:        user.ID,
		Name:          user.Name,
		Role:          user.Role,
		PublisherName: user.Name,
	}
}

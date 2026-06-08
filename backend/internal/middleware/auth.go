package middleware

import (
	"errors"
	"myblog/internal/auth"
	"net/http"

	"github.com/gin-gonic/gin"
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

func RequireRole(tokens *auth.TokenManager, allowedRoles ...string) gin.HandlerFunc {
	allowed := map[string]struct{}{}
	for _, role := range allowedRoles {
		allowed[role] = struct{}{}
	}

	return func(c *gin.Context) {
		header := c.GetHeader("Authorization")
		if header == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "请先登录"})
			c.Abort()
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
			msg := "无效的认证信息"
			if errors.Is(err, auth.ErrExpiredToken) {
				msg = "登录已过期，请重新登录"
			}
			c.JSON(http.StatusUnauthorized, gin.H{"error": msg})
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

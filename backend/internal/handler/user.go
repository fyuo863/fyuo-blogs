package handler

import (
	"errors"
	"myblog/internal/database"
	"myblog/internal/service"
	"myblog/log"
	"net/http"

	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	auth *service.AuthService
}

type LoginRequest struct {
	Name     string `json:"name"`
	Password string `json:"password"`
}

func NewAuthHandler(auth *service.AuthService) *AuthHandler {
	return &AuthHandler{auth: auth}
}

func (h *AuthHandler) SignIn(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的请求格式或缺少字段"})
		return
	}

	result, err := h.auth.Authenticate(req.Name, req.Password)
	if errors.Is(err, service.ErrInvalidCredentials) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "用户名或密码错误"})
		return
	}
	if err != nil {
		log.Logger.Error("登录失败", "error", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "登录失败"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "登录成功，欢迎回来！",
		"data": gin.H{
			"id":    result.User.ID,
			"name":  result.User.Name,
			"role":  result.User.Role,
			"token": result.Token,
		},
	})
}

func SignUp(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的请求格式或缺少字段"})
		return
	}

	user := database.AuthorCreate(req.Name, req.Password)
	if user.ID == 0 {
		c.JSON(http.StatusConflict, gin.H{"error": "用户名已存在或创建失败"})
		return
	}

	log.Logger.Info("新用户注册成功", "name", user.Name, "role", user.Role)
	c.JSON(http.StatusCreated, gin.H{
		"message": "注册成功",
		"data": gin.H{
			"id":   user.ID,
			"name": user.Name,
			"role": user.Role,
		},
	})
}

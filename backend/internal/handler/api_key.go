package handler

import (
	"errors"
	"myblog/internal/middleware"
	"myblog/internal/model"
	"myblog/internal/service"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type APIKeyHandler struct {
	keys *service.APIKeyService
	auth *service.AuthService
}

type createAPIKeyRequest struct {
	Name   string `json:"name"`
	UserID uint   `json:"user_id"`
}

type updateAPIKeyRequest struct {
	Name    *string `json:"name"`
	Enabled *bool   `json:"enabled"`
	UserID  *uint   `json:"user_id"`
}

func NewAPIKeyHandler(keys *service.APIKeyService, auth *service.AuthService) *APIKeyHandler {
	return &APIKeyHandler{keys: keys, auth: auth}
}

func (h *APIKeyHandler) List(c *gin.Context) {
	actor, err := h.currentUser(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "身份验证失败"})
		return
	}
	data, err := h.keys.List(c.Request.Context(), actor)
	if errors.Is(err, service.ErrAPIKeyAdminOnly) {
		c.JSON(http.StatusForbidden, gin.H{"error": "仅管理员可管理 API Key"})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "查询 API Key 失败"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": data})
}

func (h *APIKeyHandler) Create(c *gin.Context) {
	var req createAPIKeyRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的请求格式或缺少字段"})
		return
	}
	actor, err := h.currentUser(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "身份验证失败"})
		return
	}
	item, plain, err := h.keys.Create(c.Request.Context(), actor, service.APIKeyCreateInput{
		Name:   req.Name,
		UserID: req.UserID,
	})
	if errors.Is(err, service.ErrAPIKeyAdminOnly) {
		c.JSON(http.StatusForbidden, gin.H{"error": "仅管理员可管理 API Key"})
		return
	}
	if errors.Is(err, service.ErrAPIKeyInvalidInput) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "名称和绑定账号不能为空"})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "创建 API Key 失败"})
		return
	}
	c.JSON(http.StatusCreated, gin.H{
		"data": gin.H{
			"item": item,
			"key":  plain,
		},
	})
}

func (h *APIKeyHandler) Update(c *gin.Context) {
	id, ok := parseUintParam(c, "id")
	if !ok {
		return
	}
	var req updateAPIKeyRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的请求格式"})
		return
	}
	actor, err := h.currentUser(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "身份验证失败"})
		return
	}
	item, err := h.keys.Update(c.Request.Context(), actor, id, service.APIKeyUpdateInput{
		Name:    req.Name,
		Enabled: req.Enabled,
		UserID:  req.UserID,
	})
	if errors.Is(err, service.ErrAPIKeyAdminOnly) {
		c.JSON(http.StatusForbidden, gin.H{"error": "仅管理员可管理 API Key"})
		return
	}
	if errors.Is(err, service.ErrAPIKeyInvalidInput) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "API Key 参数无效"})
		return
	}
	if errors.Is(err, service.ErrAPIKeyNotFound) {
		c.JSON(http.StatusNotFound, gin.H{"error": "API Key 不存在"})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "更新 API Key 失败"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": item})
}

func (h *APIKeyHandler) Rotate(c *gin.Context) {
	id, ok := parseUintParam(c, "id")
	if !ok {
		return
	}
	actor, err := h.currentUser(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "身份验证失败"})
		return
	}
	item, plain, err := h.keys.Rotate(c.Request.Context(), actor, id)
	if errors.Is(err, service.ErrAPIKeyAdminOnly) {
		c.JSON(http.StatusForbidden, gin.H{"error": "仅管理员可管理 API Key"})
		return
	}
	if errors.Is(err, service.ErrAPIKeyNotFound) {
		c.JSON(http.StatusNotFound, gin.H{"error": "API Key 不存在"})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "轮换 API Key 失败"})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"data": gin.H{
			"item": item,
			"key":  plain,
		},
	})
}

func (h *APIKeyHandler) Delete(c *gin.Context) {
	id, ok := parseUintParam(c, "id")
	if !ok {
		return
	}
	actor, err := h.currentUser(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "身份验证失败"})
		return
	}
	err = h.keys.Delete(c.Request.Context(), actor, id)
	if errors.Is(err, service.ErrAPIKeyAdminOnly) {
		c.JSON(http.StatusForbidden, gin.H{"error": "仅管理员可管理 API Key"})
		return
	}
	if errors.Is(err, service.ErrAPIKeyNotFound) {
		c.JSON(http.StatusNotFound, gin.H{"error": "API Key 不存在"})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "删除 API Key 失败"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "删除成功"})
}

func (h *APIKeyHandler) ListPublisherUsers(c *gin.Context) {
	actor, err := h.currentUser(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "身份验证失败"})
		return
	}
	if actor.Role != "admin" {
		c.JSON(http.StatusForbidden, gin.H{"error": "仅管理员可查看可绑定账号"})
		return
	}
	users, err := h.auth.ListPrivilegedUsers()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "查询账号列表失败"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": users})
}

func (h *APIKeyHandler) currentUser(c *gin.Context) (model.User, error) {
	if claims, ok := middleware.Claims(c); ok {
		return h.auth.UserFromClaims(claims), nil
	}
	return model.User{}, service.ErrInvalidCredentials
}

func parseUintParam(c *gin.Context, key string) (uint, bool) {
	value, err := strconv.ParseUint(c.Param(key), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的 ID"})
		return 0, false
	}
	return uint(value), true
}

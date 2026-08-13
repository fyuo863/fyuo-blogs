package handler

import (
	"errors"
	"myblog/internal/service"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

type HomeContentHandler struct {
	content *service.HomeContentService
}

func NewHomeContentHandler(content *service.HomeContentService) *HomeContentHandler {
	return &HomeContentHandler{content: content}
}

func (h *HomeContentHandler) Get(c *gin.Context) {
	content, err := h.content.Get()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "读取首页内容失败"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": content})
}

func (h *HomeContentHandler) Update(c *gin.Context) {
	var req service.HomeContentInput
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的首页内容格式"})
		return
	}
	content, err := h.content.Update(c.Request.Context(), req)
	if errors.Is(err, service.ErrInvalidHomeContent) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "封面与每个项目都需要 GitHub 仓库链接和简介"})
		return
	}
	if errors.Is(err, service.ErrRepositoryMetadata) {
		detail := strings.TrimPrefix(err.Error(), service.ErrRepositoryMetadata.Error()+": ")
		c.JSON(http.StatusBadRequest, gin.H{"error": "无法从 GitHub README 获取新仓库展示图：" + detail + "。请确认链接公开且 README 包含非徽章图片。"})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "保存首页内容失败"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": content})
}

package handler

import (
	"errors"
	"myblog/internal/service"
	"net/http"

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
	var req service.HomeContent
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的首页内容格式"})
		return
	}
	content, err := h.content.Update(req)
	if errors.Is(err, service.ErrInvalidHomeContent) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "封面与每个项目都需要封面、标题和描述"})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "保存首页内容失败"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": content})
}

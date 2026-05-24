package handler

import (
	"context"
	"myblog/internal/service"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func IncrementView(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的文章ID"})
		return
	}

	// 静默失败：浏览计数为尽力而为
	_ = service.IncrementView(context.Background(), uint(id))
	c.JSON(http.StatusOK, gin.H{"message": "ok"})
}

func ToggleLike(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的文章ID"})
		return
	}

	clientIP := c.ClientIP()
	ipHash := service.HashIP(clientIP)

	liked, err := service.ToggleLike(context.Background(), uint(id), ipHash)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "操作失败，请稍后重试"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"liked": liked})
}

package handler

import (
	"errors"
	"myblog/internal/service"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func IncrementView(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid article id"})
		return
	}

	snapshot, err := service.IncrementView(c.Request.Context(), uint(id))
	if errors.Is(err, service.ErrArticleNotFound) {
		c.JSON(http.StatusNotFound, gin.H{"error": "article not found"})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to increment view count"})
		return
	}

	c.JSON(http.StatusOK, snapshot)
}

func ToggleLike(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid article id"})
		return
	}

	result, err := service.ToggleLike(c.Request.Context(), uint(id), service.HashIP(c.ClientIP()))
	if errors.Is(err, service.ErrArticleNotFound) {
		c.JSON(http.StatusNotFound, gin.H{"error": "article not found"})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to toggle like"})
		return
	}

	c.JSON(http.StatusOK, result)
}

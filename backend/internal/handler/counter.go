package handler

import (
	"errors"
	"myblog/internal/service"
	"myblog/log"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type CounterHandler struct {
	records *service.VisitRecordService
}

func NewCounterHandler(records *service.VisitRecordService) *CounterHandler {
	return &CounterHandler{records: records}
}

func (h *CounterHandler) IncrementView(c *gin.Context) {
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

	if h.records != nil {
		if recordErr := h.records.RecordArticleVisit(c.Request.Context(), service.VisitRecordInput{
			ArticleID: uint(id),
			VisitorID: c.GetHeader("X-Visitor-Id"),
			IPAddress: c.ClientIP(),
			UserAgent: c.Request.UserAgent(),
		}); recordErr != nil {
			log.Logger.Warn("记录访客访问失败", "article_id", id, "error", recordErr)
		}
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

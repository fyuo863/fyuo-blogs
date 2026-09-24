package handler

import (
	"errors"
	"myblog/internal/service"
	"myblog/log"
	"net/http"
	"strconv"
	"time"

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

	if service.Visits != nil {
		eventID := c.GetHeader("X-Event-Id")
		if eventID == "" {
			eventID = service.NewEventID()
		}
		var ms int64
		if len(eventID) >= 13 {
			ms, _ = strconv.ParseInt(eventID[:13], 10, 64)
		}
		visitor := c.GetHeader("X-Visitor-Id")
		if visitor == "" {
			visitor = service.HashIP(c.ClientIP() + "|" + c.Request.UserAgent())
		}
		receipt, e := service.Visits.Accept(c.Request.Context(), service.VisitEvent{EventID: eventID, ArticleID: uint(id), OccurredAt: time.UnixMilli(ms), VisitorID: visitor, IPAddress: c.ClientIP()})
		if e != nil {
			status := http.StatusServiceUnavailable
			if errors.Is(e, service.ErrVisitInvalid) {
				status = http.StatusBadRequest
			}
			if errors.Is(e, service.ErrArticleNotFound) {
				status = http.StatusNotFound
			}
			if errors.Is(e, service.ErrVisitRate) {
				status = http.StatusTooManyRequests
			}
			if status == 503 || status == 429 {
				c.Header("Retry-After", "2")
			}
			acceptance := "unknown"
			if status == 400 || status == 404 || status == 429 || errors.Is(e, service.ErrVisitFull) || errors.Is(e, service.ErrCounterUnavailable) {
				acceptance = "not_accepted"
			}
			c.JSON(status, gin.H{"error": e.Error(), "acceptance": acceptance, "retryable": status == 503 || status == 429})
			return
		}
		c.JSON(http.StatusOK, receipt)
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

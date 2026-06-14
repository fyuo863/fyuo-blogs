package handler

import (
	"errors"
	"myblog/internal/middleware"
	"myblog/internal/service"
	"net/http"

	"github.com/gin-gonic/gin"
)

type VisitRecordHandler struct {
	records *service.VisitRecordService
}

func NewVisitRecordHandler(records *service.VisitRecordService) *VisitRecordHandler {
	return &VisitRecordHandler{records: records}
}

func (h *VisitRecordHandler) List(c *gin.Context) {
	role := ""
	if claims, ok := middleware.Claims(c); ok {
		role = claims.Role
	}

	result, err := h.records.List(
		c.Request.Context(),
		role,
		c.DefaultQuery("sort", "latest"),
	)
	if errors.Is(err, service.ErrAdminOnly) {
		c.JSON(http.StatusForbidden, gin.H{"error": "仅管理员可查看访客记录"})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "查询访客记录失败"})
		return
	}

	c.JSON(http.StatusOK, result)
}

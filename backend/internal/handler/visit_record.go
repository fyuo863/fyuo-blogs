package handler

import (
	"errors"
	"myblog/internal/middleware"
	"myblog/internal/repository"
	"myblog/internal/service"
	"net/http"
	"strconv"
	"time"

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

	filter, err := parseVisitFilter(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "筛选参数无效，请检查日期、文章 ID 和分页设置"})
		return
	}
	result, err := h.records.List(c.Request.Context(), role, filter)
	if errors.Is(err, service.ErrAdminOnly) {
		c.JSON(http.StatusForbidden, gin.H{"error": "仅管理员可查看访客记录"})
		return
	}
	if err != nil {
		if errors.Is(err, service.ErrInvalidVisitFilter) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "筛选参数无效"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "查询访客记录失败"})
		return
	}

	c.JSON(http.StatusOK, result)
}

func parseVisitFilter(c *gin.Context) (repository.VisitRecordFilter, error) {
	filter := repository.VisitRecordFilter{Sort: c.DefaultQuery("sort", "latest"), Search: c.Query("search")}
	var err error
	for key, target := range map[string]*int{"page": &filter.Page, "page_size": &filter.PageSize} {
		if value, exists := c.GetQuery(key); exists {
			*target, err = strconv.Atoi(value)
			if err != nil || *target < 1 {
				return filter, service.ErrInvalidVisitFilter
			}
		}
	}
	if value, exists := c.GetQuery("article_id"); exists {
		id, e := strconv.ParseUint(value, 10, 32)
		if e != nil || id == 0 {
			return filter, service.ErrInvalidVisitFilter
		}
		filter.ArticleID = uint(id)
	}
	for key, target := range map[string]*time.Time{"from": &filter.From, "until": &filter.Until} {
		if value, exists := c.GetQuery(key); exists {
			*target, err = time.Parse(time.RFC3339, value)
			if err != nil {
				return filter, service.ErrInvalidVisitFilter
			}
		}
	}
	return filter, service.NormalizeVisitFilter(&filter)
}

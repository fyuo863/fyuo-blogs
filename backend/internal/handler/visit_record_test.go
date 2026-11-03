package handler

import (
	"context"
	"errors"
	"fmt"
	"myblog/internal/model"
	"myblog/internal/repository"
	"myblog/internal/service"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
)

func TestVisitFilterValidation(t *testing.T) {
	for _, tc := range []struct {
		query string
		valid bool
	}{
		{"", true},
		{"page=2&page_size=25&sort=oldest&article_id=42&from=2026-11-01T00:00:00%2B08:00&until=2026-11-03T00:00:00%2B08:00", true},
		{"page=-1", false}, {"page=0", false}, {"page_size=201", false},
		{"page=9999999999999999999999", false}, {"sort=invalid", false},
		{"article_id=1%20OR%201=1", false}, {"article_id=0", false},
		{"from=invalid", false}, {"from=2026-11-03T00:00:00Z&until=2026-11-01T00:00:00Z", false},
	} {
		t.Run(tc.query, func(t *testing.T) {
			c, _ := gin.CreateTestContext(httptest.NewRecorder())
			c.Request = httptest.NewRequest("GET", "/?"+tc.query, nil)
			filter, err := parseVisitFilter(c)
			if (err == nil) != tc.valid {
				t.Fatalf("filter=%+v err=%v", filter, err)
			}
			if tc.query == "" && (filter.Page != 1 || filter.PageSize != 50) {
				t.Fatal("invalid defaults")
			}
		})
	}
}

func TestVisitQueryCountsPaginationAndFilters(t *testing.T) {
	db := pluginTestDB(t)
	if err := db.AutoMigrate(&model.VisitRecord{}); err != nil {
		t.Fatal(err)
	}
	first, second := uint(41), uint(42)
	start := time.Date(2026, 11, 1, 0, 0, 0, 0, time.UTC)
	rows := make([]model.VisitRecord, 225)
	for i := range rows {
		articleID, title, stamp := &first, "文章 A", start
		if i >= 205 {
			articleID, title = &second, "文章 B"
		}
		if i >= 215 {
			stamp = start.Add(24 * time.Hour)
		}
		if i == 0 {
			title = "100%_ complete"
		}
		rows[i] = model.VisitRecord{VisitorID: fmt.Sprintf("browser-%d", i%4), ArticleID: articleID, ContentTitle: title, IPAddress: "198.51.100.1", City: "unknown", CreatedAt: stamp}
	}
	if err := db.Create(&rows).Error; err != nil {
		t.Fatal(err)
	}
	svc := service.NewVisitRecordService(repository.NewVisitRecordRepository(db), nil)
	ctx := context.Background()
	result, err := svc.List(ctx, "admin", repository.VisitRecordFilter{Page: 2, PageSize: 25})
	if err != nil {
		t.Fatal(err)
	}
	if result.Total != 225 || result.BrowserCount != 4 || result.ArticleCount != 2 || result.TotalPages != 9 || len(result.Data) != 25 || result.Data[0].ID != rows[199].ID {
		t.Fatalf("incorrect page: %+v", result)
	}
	oldest, err := svc.List(ctx, "admin", repository.VisitRecordFilter{Sort: "oldest", PageSize: 25})
	if err != nil || oldest.Data[0].ID != rows[0].ID {
		t.Fatalf("unstable oldest page: %v", err)
	}
	filtered, err := svc.List(ctx, "admin", repository.VisitRecordFilter{ArticleID: second, From: start.Add(24 * time.Hour), Until: start.Add(48 * time.Hour), Page: 999})
	if err != nil || filtered.Total != 10 || filtered.Page != 1 || filtered.ArticleCount != 1 {
		t.Fatalf("filtered=%+v err=%v", filtered, err)
	}
	literal, err := svc.List(ctx, "admin", repository.VisitRecordFilter{Search: "%_"})
	if err != nil || literal.Total != 1 {
		t.Fatalf("search wildcards not escaped: %+v %v", literal, err)
	}
	empty, err := svc.List(ctx, "admin", repository.VisitRecordFilter{Search: "missing"})
	if err != nil || empty.Total != 0 || empty.Data == nil || empty.Page != 1 {
		t.Fatalf("empty=%+v err=%v", empty, err)
	}
	if _, err := svc.List(ctx, "agent", repository.VisitRecordFilter{}); !errors.Is(err, service.ErrAdminOnly) {
		t.Fatalf("role bypass: %v", err)
	}
	cancelled, cancel := context.WithCancel(ctx)
	cancel()
	if _, err := svc.List(cancelled, "admin", repository.VisitRecordFilter{}); err == nil {
		t.Fatal("cancelled database query succeeded")
	}
}

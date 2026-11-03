package service

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"myblog/internal/model"
	"myblog/internal/repository"
	"strings"
	"unicode/utf8"
)

var ErrAdminOnly = errors.New("admin only")
var ErrInvalidVisitFilter = errors.New("invalid visit filter")

type VisitRecordService struct {
	records  *repository.VisitRecordRepository
	articles *repository.ArticleRepository
}

type VisitRecordInput struct {
	ArticleID uint
	VisitorID string
	IPAddress string
	UserAgent string
}

type VisitRecordListResult = repository.VisitRecordPage

func NewVisitRecordService(records *repository.VisitRecordRepository, articles *repository.ArticleRepository) *VisitRecordService {
	return &VisitRecordService{
		records:  records,
		articles: articles,
	}
}

func (s *VisitRecordService) RecordArticleVisit(ctx context.Context, input VisitRecordInput) error {
	article, err := s.articles.GetByID(input.ArticleID)
	if err != nil {
		return err
	}

	articleID := article.ID
	record := model.VisitRecord{
		VisitorID:    normalizeVisitorID(input.VisitorID, input.IPAddress, input.UserAgent),
		IPAddress:    normalizeIPAddress(input.IPAddress),
		City:         lookupCity(ctx, input.IPAddress),
		ContentTitle: article.Title,
		ArticleID:    &articleID,
	}
	return s.records.Create(&record)
}

func (s *VisitRecordService) List(ctx context.Context, role string, filter repository.VisitRecordFilter) (VisitRecordListResult, error) {
	if role != "admin" {
		return VisitRecordListResult{}, ErrAdminOnly
	}

	if err := NormalizeVisitFilter(&filter); err != nil {
		return VisitRecordListResult{}, err
	}
	return s.records.List(ctx, filter)
}

func NormalizeVisitFilter(filter *repository.VisitRecordFilter) error {
	filter.Sort = strings.ToLower(strings.TrimSpace(filter.Sort))
	filter.Search = strings.TrimSpace(filter.Search)
	if filter.Sort == "" {
		filter.Sort = "latest"
	}
	if filter.Page == 0 {
		filter.Page = 1
	}
	if filter.PageSize == 0 {
		filter.PageSize = 50
	}
	if (filter.Sort != "latest" && filter.Sort != "oldest") || filter.Page < 1 || filter.Page > 1000000 || filter.PageSize < 1 || filter.PageSize > 200 || utf8.RuneCountInString(filter.Search) > 120 {
		return ErrInvalidVisitFilter
	}
	if !filter.From.IsZero() && !filter.Until.IsZero() && !filter.From.Before(filter.Until) {
		return ErrInvalidVisitFilter
	}
	return nil
}

func normalizeVisitorID(visitorID, ipAddress, userAgent string) string {
	trimmed := strings.TrimSpace(visitorID)
	if trimmed != "" {
		return trimmed
	}
	sum := sha256.Sum256([]byte(ipAddress + "|" + userAgent))
	return hex.EncodeToString(sum[:16])
}

func normalizeIPAddress(ip string) string {
	ip = strings.TrimSpace(ip)
	if ip == "" {
		return "unknown"
	}
	return ip
}

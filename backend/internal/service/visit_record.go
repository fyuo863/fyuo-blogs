package service

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"myblog/internal/model"
	"myblog/internal/repository"
	"strings"
)

var ErrAdminOnly = errors.New("admin only")

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

type VisitRecordListResult struct {
	Data []model.VisitRecord `json:"data"`
}

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

func (s *VisitRecordService) List(ctx context.Context, role, sort string) (VisitRecordListResult, error) {
	_ = ctx
	if role != "admin" {
		return VisitRecordListResult{}, ErrAdminOnly
	}

	records, err := s.records.List(repository.VisitRecordFilter{
		Sort: sort,
	})
	if err != nil {
		return VisitRecordListResult{}, err
	}
	return VisitRecordListResult{Data: records}, nil
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

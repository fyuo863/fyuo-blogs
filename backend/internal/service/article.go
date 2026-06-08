package service

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"myblog/internal/database"
	"myblog/internal/model"
	"myblog/internal/repository"
	"time"

	"gorm.io/gorm"
)

var (
	ErrArticleNotFound = errors.New("article not found")
	ErrNoArticleUpdate = errors.New("no article fields to update")
)

type ArticleService struct {
	articles *repository.ArticleRepository
}

type ArticleInput struct {
	Title   string
	Content string
	Stage   string
	Vol     int
	Tags    []string
}

type ArticleUpdate struct {
	Title   *string
	Content *string
	Stage   *string
	Vol     *int
	Tags    []string
}

type ArticleListResult struct {
	Data     []model.Article `json:"data"`
	Total    int64           `json:"total"`
	Page     int             `json:"page"`
	PageSize int             `json:"page_size"`
}

func NewArticleService(articles *repository.ArticleRepository) *ArticleService {
	return &ArticleService{articles: articles}
}

func (s *ArticleService) Create(ctx context.Context, author model.User, input ArticleInput) (model.Article, error) {
	article := model.Article{
		Title:    input.Title,
		Content:  input.Content,
		Stage:    normalizeStage(input.Stage),
		Vol:      input.Vol,
		AuthorID: author.ID,
		Tags:     input.Tags,
	}
	if article.Vol == 0 {
		article.Vol = 1
	}
	if err := s.articles.Create(&article); err != nil {
		return article, err
	}
	s.refreshListCache(ctx)
	return article, nil
}

func (s *ArticleService) List(ctx context.Context, page, pageSize int) (ArticleListResult, error) {
	page, pageSize = normalizePagination(page, pageSize)
	cacheKey := articleListCacheKey(page, pageSize)

	if cached, ok := s.readListCache(ctx, cacheKey); ok {
		return cached, nil
	}

	articles, total, err := s.articles.ListVisible(page, pageSize)
	if err != nil {
		return ArticleListResult{}, err
	}
	result := ArticleListResult{
		Data:     articles,
		Total:    total,
		Page:     page,
		PageSize: pageSize,
	}
	s.writeListCache(ctx, cacheKey, result, listCacheTTL(page, pageSize))
	return result, nil
}

func (s *ArticleService) Search(query string) ([]model.Article, error) {
	return s.articles.SearchVisible(query, 20)
}

func (s *ArticleService) Get(id uint) (model.Article, error) {
	article, err := s.articles.GetVisible(id)
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return article, ErrArticleNotFound
	}
	return article, err
}

func (s *ArticleService) Update(ctx context.Context, id uint, update ArticleUpdate) (model.Article, error) {
	article, err := s.articles.Update(id, repository.ArticleUpdate{
		Title:   update.Title,
		Content: update.Content,
		Stage:   update.Stage,
		Vol:     update.Vol,
		Tags:    update.Tags,
	})
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return article, ErrArticleNotFound
	}
	if errors.Is(err, gorm.ErrInvalidData) {
		return article, ErrNoArticleUpdate
	}
	if err != nil {
		return article, err
	}
	s.refreshListCache(ctx)
	return article, nil
}

func (s *ArticleService) Delete(ctx context.Context, id uint) error {
	deleted, err := s.articles.SoftDelete(id)
	if err != nil {
		return err
	}
	if !deleted {
		return ErrArticleNotFound
	}
	s.refreshListCache(ctx)
	return nil
}

func (s *ArticleService) refreshListCache(ctx context.Context) {
	database.InvalidateBlogListCache()
	articles, total, err := s.articles.ListVisible(1, 10)
	if err != nil {
		return
	}
	result := ArticleListResult{
		Data:     articles,
		Total:    total,
		Page:     1,
		PageSize: 10,
	}
	s.writeListCache(ctx, articleListCacheKey(1, 10), result, 0)
}

func (s *ArticleService) readListCache(ctx context.Context, key string) (ArticleListResult, bool) {
	var result ArticleListResult
	if database.RDB == nil {
		return result, false
	}
	raw, err := database.RDB.Get(ctx, key).Result()
	if err != nil {
		return result, false
	}
	if err := json.Unmarshal([]byte(raw), &result); err != nil {
		return result, false
	}
	return result, true
}

func (s *ArticleService) writeListCache(ctx context.Context, key string, result ArticleListResult, expiration time.Duration) {
	if database.RDB == nil {
		return
	}
	payload, err := json.Marshal(result)
	if err != nil {
		return
	}
	database.RDB.Set(ctx, key, payload, expiration)
}

func articleListCacheKey(page, pageSize int) string {
	return fmt.Sprintf("blogs:page:%d:size:%d", page, pageSize)
}

func listCacheTTL(page, pageSize int) time.Duration {
	if page == 1 && pageSize == 10 {
		return 0
	}
	return time.Hour
}

func normalizePagination(page, pageSize int) (int, int) {
	if page < 1 {
		page = 1
	}
	if pageSize < 1 {
		pageSize = 10
	}
	if pageSize > 100 {
		pageSize = 100
	}
	return page, pageSize
}

func normalizeStage(stage string) string {
	if stage == "" {
		return "published"
	}
	return stage
}

package handler

import (
	"errors"
	"myblog/internal/middleware"
	"myblog/internal/model"
	"myblog/internal/service"
	"myblog/log"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type ArticleHandler struct {
	articles *service.ArticleService
	auth     *service.AuthService
}

type CreateBlogRequest struct {
	Title      string   `json:"title"`
	Content    string   `json:"content"`
	CoverImage string   `json:"cover_image"`
	Stage      string   `json:"stage"`
	Vol        int      `json:"vol"`
	Tags       []string `json:"tags"`
}

type UpdateBlogRequest struct {
	Title      *string  `json:"title"`
	Content    *string  `json:"content"`
	CoverImage *string  `json:"cover_image"`
	Stage      *string  `json:"stage"`
	Vol        *int     `json:"vol"`
	Tags       []string `json:"tags"`
}

func NewArticleHandler(articles *service.ArticleService, auth *service.AuthService) *ArticleHandler {
	return &ArticleHandler{articles: articles, auth: auth}
}

func (h *ArticleHandler) CreateBlog(c *gin.Context) {
	var req CreateBlogRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的请求格式或缺少字段"})
		return
	}

	author, err := h.currentUser(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "身份验证失败"})
		return
	}
	claims, _ := middleware.Claims(c)

	article, err := h.articles.Create(c.Request.Context(), author, service.ArticleInput{
		Title:         req.Title,
		Content:       req.Content,
		CoverImage:    req.CoverImage,
		Stage:         req.Stage,
		Vol:           req.Vol,
		Tags:          req.Tags,
		PublisherName: h.auth.PublisherNameFromClaims(claims),
	})
	if err != nil {
		log.Logger.Error("创建文章失败", "error", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "创建文章失败"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"data": article})
}

func (h *ArticleHandler) ListBlogs(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "10"))

	result, err := h.articles.List(c.Request.Context(), page, pageSize)
	if err != nil {
		log.Logger.Error("查询文章列表失败", "error", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "查询文章列表失败"})
		return
	}

	c.JSON(http.StatusOK, result)
}

func (h *ArticleHandler) SearchBlogs(c *gin.Context) {
	query := c.Query("q")
	if query == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "搜索关键词不能为空"})
		return
	}

	articles, err := h.articles.Search(c.Request.Context(), query)
	if err != nil {
		log.Logger.Error("搜索文章失败", "query", query, "error", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "搜索失败"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": articles, "total": len(articles), "query": query})
}

func (h *ArticleHandler) GetBlog(c *gin.Context) {
	id, ok := parseID(c)
	if !ok {
		return
	}

	article, err := h.articles.Get(c.Request.Context(), id)
	if errors.Is(err, service.ErrArticleNotFound) {
		c.JSON(http.StatusNotFound, gin.H{"error": "文章不存在或已被隐藏"})
		return
	}
	if err != nil {
		log.Logger.Error("查询文章失败", "id", id, "error", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "查询文章失败"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": article})
}

func (h *ArticleHandler) UpdateBlog(c *gin.Context) {
	id, ok := parseID(c)
	if !ok {
		return
	}

	var req UpdateBlogRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的请求格式"})
		return
	}

	if _, err := h.currentUser(c); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "身份验证失败"})
		return
	}

	currentUser, _ := h.currentUser(c)
	article, err := h.articles.Update(c.Request.Context(), currentUser, id, service.ArticleUpdate{
		Title:      req.Title,
		Content:    req.Content,
		CoverImage: req.CoverImage,
		Stage:      req.Stage,
		Vol:        req.Vol,
		Tags:       req.Tags,
	})
	if errors.Is(err, service.ErrArticleNotFound) {
		c.JSON(http.StatusNotFound, gin.H{"error": "文章不存在"})
		return
	}
	if errors.Is(err, service.ErrArticleForbidden) {
		c.JSON(http.StatusForbidden, gin.H{"error": "只能编辑自己发布的文章"})
		return
	}
	if errors.Is(err, service.ErrNoArticleUpdate) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "没有需要更新的字段"})
		return
	}
	if err != nil {
		log.Logger.Error("更新文章失败", "id", id, "error", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "更新文章失败"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": article})
}

func (h *ArticleHandler) DeleteBlog(c *gin.Context) {
	id, ok := parseID(c)
	if !ok {
		return
	}

	currentUser, err := h.currentUser(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "身份验证失败"})
		return
	}

	if err := h.articles.DeleteByActor(c.Request.Context(), currentUser, id); errors.Is(err, service.ErrArticleNotFound) {
		c.JSON(http.StatusNotFound, gin.H{"error": "文章不存在"})
		return
	} else if errors.Is(err, service.ErrArticleForbidden) {
		c.JSON(http.StatusForbidden, gin.H{"error": "仅管理员可以删除文章"})
		return
	} else if err != nil {
		log.Logger.Error("删除文章失败", "id", id, "error", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "删除文章失败"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "删除成功"})
}

func (h *ArticleHandler) currentUser(c *gin.Context) (model.User, error) {
	if claims, ok := middleware.Claims(c); ok {
		return h.auth.UserFromClaims(claims), nil
	}
	return model.User{}, service.ErrInvalidCredentials
}

func parseID(c *gin.Context) (uint, bool) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的文章ID"})
		return 0, false
	}
	return uint(id), true
}

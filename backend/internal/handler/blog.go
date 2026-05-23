package handler

import (
	"errors"
	"myblog/internal/database"
	"myblog/internal/model"
	"myblog/log"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

type CreateBlogRequest struct {
	Name     string   `json:"name"`
	Password string   `json:"password"`
	Title    string   `json:"title"`
	Content  string   `json:"content"`
	Stage    string   `json:"stage"`
	Vol      int      `json:"vol"`
	Tags     []string `json:"tags"`
}

type UpdateBlogRequest struct {
	Name     *string  `json:"name"`
	Password *string  `json:"password"`
	Title    *string  `json:"title"`
	Content  *string  `json:"content"`
	Stage    *string  `json:"stage"`
	Vol      *int     `json:"vol"`
	Tags     []string `json:"tags"`
}

func authenticateUser(name, password string) (model.User, error) {
	var user model.User
	if result := database.DB.Where("name = ?", name).First(&user); result.Error != nil {
		return user, errors.New("用户不存在")
	}
	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password)); err != nil {
		return user, errors.New("密码错误")
	}
	return user, nil
}

func CreateBlog(c *gin.Context) {
	log.Logger.Info("创建文章请求")
	var req CreateBlogRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的请求格式或缺少字段"})
		return
	}

	// 验证用户名和密码，获取作者 ID
	author, err := authenticateUser(req.Name, req.Password)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "身份验证失败"})
		return
	}
	log.Logger.Info("创建文章请求", "author", author.ID)
	article := model.Article{
		Title:    req.Title,
		Content:  req.Content,
		Stage:    req.Stage,
		Vol:      req.Vol,
		AuthorID: author.ID,
		Tags:     req.Tags,
	}
	log.Logger.Info("创建文章请求", "article", article)
	result := database.DB.Create(&article)
	if result.Error != nil {
		log.Logger.Error("创建文章失败", "error", result.Error)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "创建文章失败"})
		return
	}

	log.Logger.Info("创建文章成功", "id", article.ID, "title", article.Title)
	c.JSON(http.StatusCreated, gin.H{"data": article})
}

func ListBlogs(c *gin.Context) {
	var articles []model.Article

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "10"))
	offset := (page - 1) * pageSize

	var total int64
	database.DB.Model(&model.Article{}).Count(&total)

	result := database.DB.Order("created_at DESC").Offset(offset).Limit(pageSize).Find(&articles)
	if result.Error != nil {
		log.Logger.Error("查询文章列表失败", "error", result.Error)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "查询文章列表失败"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data":      articles,
		"total":     total,
		"page":      page,
		"page_size": pageSize,
	})
}

func GetBlog(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的文章ID"})
		return
	}

	var article model.Article
	result := database.DB.First(&article, id)
	if result.Error != nil {
		log.Logger.Error("查询文章失败", "id", id, "error", result.Error)
		c.JSON(http.StatusNotFound, gin.H{"error": "文章不存在"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": article})
}

func UpdateBlog(c *gin.Context) {
	log.Logger.Info("更新文章请求")
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的文章ID"})
		return
	}

	var article model.Article
	if result := database.DB.First(&article, id); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "文章不存在"})
		return
	}

	var req UpdateBlogRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的请求格式"})
		return
	}

	// 验证身份
	if req.Name != nil && req.Password != nil {
		if _, err := authenticateUser(*req.Name, *req.Password); err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "身份验证失败"})
			return
		}
	}

	updates := map[string]interface{}{}
	if req.Title != nil {
		updates["title"] = *req.Title
	}
	if req.Content != nil {
		updates["content"] = *req.Content
	}
	if req.Stage != nil {
		updates["stage"] = *req.Stage
	}
	if req.Vol != nil {
		updates["vol"] = *req.Vol
	}
	if req.Tags != nil {
		updates["tags"] = req.Tags
	}

	if len(updates) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "没有需要更新的字段"})
		return
	}
	log.Logger.Info("更新文章", "id", id, "updates", updates)

	if result := database.DB.Model(&article).Updates(updates); result.Error != nil {
		log.Logger.Error("更新文章失败", "id", id, "error", result.Error)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "更新文章失败"})
		return
	}

	database.DB.First(&article, id)
	log.Logger.Info("更新文章成功", "id", article.ID, "title", article.Title)
	c.JSON(http.StatusOK, gin.H{"data": article})
}

func DeleteBlog(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的文章ID"})
		return
	}

	result := database.DB.Delete(&model.Article{}, id)
	if result.Error != nil {
		log.Logger.Error("删除文章失败", "id", id, "error", result.Error)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "删除文章失败"})
		return
	}
	if result.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "文章不存在"})
		return
	}

	log.Logger.Info("删除文章成功", "id", id)
	c.JSON(http.StatusOK, gin.H{"message": "删除成功"})
}

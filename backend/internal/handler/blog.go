package handler

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"myblog/internal/database"
	"myblog/internal/model"
	"myblog/log"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
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
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "10"))

	// 1. 定义动态的 Redis 缓存 Key (例如: blogs:page:1:size:10)
	cacheKey := fmt.Sprintf("blogs:page:%d:size:%d", page, pageSize)
	ctx := context.Background()

	// 2. 尝试从 Redis 中获取数据
	// 注意：根据你实际项目初始化的 Redis 变量名修改 database.RDB
	cachedData, err := database.RDB.Get(ctx, cacheKey).Result()
	if err == nil {
		log.Logger.Info("Redis 缓存命中！", "key", cacheKey)
		
		// 因为 Redis 存的是字符串，我们需要反序列化回 Go 的 map 结构
		var responseData map[string]interface{}
		json.Unmarshal([]byte(cachedData), &responseData)
		
		c.JSON(http.StatusOK, responseData)
		return
	} else if err != redis.Nil {
		// 如果报错且不是因为“Key不存在”造成的，只打印警告，不中断流程，降级去查数据库
		log.Logger.Warn("Redis 读取异常，降级到数据库查询", "error", err)
	}

	// 3. 缓存未命中 (Cache Miss)，去 PostgreSQL 数据库查询
	log.Logger.Info("Redis 未命中，从 PostgreSQL 读取数据")
	var articles []model.Article
	offset := (page - 1) * pageSize

	var total int64
	database.DB.Model(&model.Article{}).Count(&total)

	result := database.DB.Order("created_at DESC").Offset(offset).Limit(pageSize).Find(&articles)
	if result.Error != nil {
		log.Logger.Error("查询文章列表失败", "error", result.Error)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "查询文章列表失败"})
		return
	}

	// 构造原本要返回的数据
	responseData := gin.H{
		"data":      articles,
		"total":     total,
		"page":      page,
		"page_size": pageSize,
	}

	// 4. 存入 Redis，并设置 1 小时 (time.Hour) 过期时间
	jsonData, marshalErr := json.Marshal(responseData)
	if marshalErr == nil {
		// 将 JSON 字符串存入 Redis
		setErr := database.RDB.Set(ctx, cacheKey, jsonData, time.Hour).Err()
		if setErr != nil {
			log.Logger.Warn("缓存写入 Redis 失败", "error", setErr)
		} else {
			log.Logger.Info("成功将文章列表缓存到 Redis", "expire", "1 hour")
		}
	}

	// 5. 将数据推送给前端
	c.JSON(http.StatusOK, responseData)
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

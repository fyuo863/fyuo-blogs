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
	"github.com/lib/pq"
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

type DeleteBlogRequest struct {
	Name     string `json:"name"`
	Password string `json:"password"`
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

	author, err := authenticateUser(req.Name, req.Password)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "身份验证失败"})
		return
	}
	
	article := model.Article{
		Title:    req.Title,
		Content:  req.Content,
		Stage:    req.Stage,
		Vol:      req.Vol,
		AuthorID: author.ID,
		Tags:     req.Tags,
	}
	
	// 1. 写入数据库
	result := database.DB.Create(&article)
	if result.Error != nil {
		log.Logger.Error("创建文章失败", "error", result.Error)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "创建文章失败"})
		return
	}

	// ==========================================
	// 2. 缓存一致性操作：清理旧分页，主动重建第一页缓存
	// ==========================================
	ctx := context.Background()
	
	// 先清理所有旧的分页缓存 (包括第一页和其他所有页)
	invalidateBlogCache()

	// 主动查出最新的 10 条数据（第一页）
	var latestArticles []model.Article
	var total int64
	database.DB.Model(&model.Article{}).Where("stage != ?", "hidden").Count(&total)
	database.DB.Where("stage != ?", "hidden").Order("created_at DESC").Limit(10).Find(&latestArticles)

	firstPageData := gin.H{
		"data":      latestArticles,
		"total":     total,
		"page":      1,
		"page_size": 10,
	}

	jsonData, marshalErr := json.Marshal(firstPageData)
	if marshalErr == nil {
		// 注意这里最后的参数是 0，代表这前 10 条数据永不过期！
		database.RDB.Set(ctx, "blogs:page:1:size:10", jsonData, 0)
		log.Logger.Info("已主动将最新 10 条文章更新至 Redis (永不过期)")
	}

	log.Logger.Info("创建文章成功", "id", article.ID, "title", article.Title)
	c.JSON(http.StatusCreated, gin.H{"data": article})
}

func ListBlogs(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "10"))

	cacheKey := fmt.Sprintf("blogs:page:%d:size:%d", page, pageSize)
	ctx := context.Background()

	// 1. 尝试从 Redis 读取
	cachedData, err := database.RDB.Get(ctx, cacheKey).Result()
	if err == nil {
		log.Logger.Info("Redis 缓存命中！", "key", cacheKey)
		var responseData map[string]interface{}
		json.Unmarshal([]byte(cachedData), &responseData)
		c.JSON(http.StatusOK, responseData)
		return
	} else if err != redis.Nil {
		log.Logger.Warn("Redis 读取异常，降级到数据库查询", "error", err)
	}

	// 2. 缓存未命中，查库
	log.Logger.Info("Redis 未命中，从 PostgreSQL 读取数据")
	var articles []model.Article
	offset := (page - 1) * pageSize

	var total int64
	database.DB.Model(&model.Article{}).Where("stage != ?", "hidden").Count(&total)

	result := database.DB.Where("stage != ?", "hidden").
		Order("created_at DESC").
		Offset(offset).
		Limit(pageSize).
		Find(&articles)
		
	if result.Error != nil {
		log.Logger.Error("查询文章列表失败", "error", result.Error)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "查询文章列表失败"})
		return
	}

	responseData := gin.H{
		"data":      articles,
		"total":     total,
		"page":      page,
		"page_size": pageSize,
	}

	// ==========================================
	// 3. 动态设置过期时间（核心逻辑）
	// ==========================================
	jsonData, marshalErr := json.Marshal(responseData)
	if marshalErr == nil {
		var expiration time.Duration
		
		// 如果请求的是第一页（最新10条），设为永不过期 (0)
		if page == 1 && pageSize == 10 {
			expiration = 0 
		} else {
			// 其他页（包括被挤到第二页的数据，或搜索结果），存活 1 小时
			expiration = time.Hour 
		}

		setErr := database.RDB.Set(ctx, cacheKey, jsonData, expiration).Err()
		if setErr != nil {
			log.Logger.Warn("缓存写入 Redis 失败", "error", setErr)
		} else {
			log.Logger.Info("文章列表已存入 Redis", "key", cacheKey, "expire", expiration)
		}
	}

	c.JSON(http.StatusOK, responseData)
}

func GetBlog(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的文章ID"})
		return
	}

	var article model.Article
	
	result := database.DB.Where("stage != ?", "hidden").First(&article, id)
	
	if result.Error != nil {
		log.Logger.Error("查询文章失败或文章已被隐藏", "id", id, "error", result.Error)
		c.JSON(http.StatusNotFound, gin.H{"error": "文章不存在或已被隐藏"})
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
		updates["tags"] = pq.StringArray(req.Tags)
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
	invalidateBlogCache()
	c.JSON(http.StatusOK, gin.H{"data": article})
	
}

func DeleteBlog(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的文章ID"})
		return
	}

	var req DeleteBlogRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的请求格式"})
		return
	}

	if _, err := authenticateUser(req.Name, req.Password); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "身份验证失败"})
		return
	}

	// 1. 数据库操作：不执行物理删除，而是更新 stage 字段为 "hidden"
	result := database.DB.Model(&model.Article{}).Where("id = ?", id).Update("stage", "hidden")
	
	if result.Error != nil {
		log.Logger.Error("删除(隐藏)文章失败", "id", id, "error", result.Error)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "删除文章失败"})
		return
	}
	
	if result.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "文章不存在"})
		return
	}

	// 2. Redis 缓存清理操作
	ctx := context.Background()
	
	// 查找所有以 "blogs:page:" 开头的缓存 Key
	// 注意：对于个人博客这种体量的应用，使用 Keys 命令查找非常方便快捷。
	keys, err := database.RDB.Keys(ctx, "blogs:page:*").Result()
	if err != nil {
		// 记录警告，但不中断给前端的成功响应，因为数据库已经更新成功了
		log.Logger.Warn("获取文章列表缓存Keys失败", "error", err)
	} else if len(keys) > 0 {
		// 批量删除匹配到的所有缓存 Key
		delErr := database.RDB.Del(ctx, keys...).Err()
		if delErr != nil {
			log.Logger.Warn("清理文章列表缓存失败", "error", delErr)
		} else {
			log.Logger.Info("清理文章列表缓存成功", "cleared_keys_count", len(keys))
		}
	}

	// [可选] 如果你之后给单篇文章 GetBlog 也做了缓存，比如 Key 叫 "blog:detail:{id}"
	// 你可以在这里顺手把它也删了：
	// database.RDB.Del(ctx, fmt.Sprintf("blog:detail:%d", id))

	log.Logger.Info("文章已标记为不显示", "id", id)
	invalidateBlogCache()
	c.JSON(http.StatusOK, gin.H{"message": "删除成功"})
}

// 清除所有博客列表的分页缓存
func invalidateBlogCache() {
	ctx := context.Background()
	// 找到所有以 blogs:page: 开头的 key
	keys, err := database.RDB.Keys(ctx, "blogs:page:*").Result()
	if err == nil && len(keys) > 0 {
		// 删除这些过期的缓存
		database.RDB.Del(ctx, keys...)
		log.Logger.Info("已清理旧的博客列表 Redis 缓存", "keys_deleted", len(keys))
	}
}
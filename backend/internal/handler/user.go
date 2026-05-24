package handler

import (
	"myblog/internal/database"
	"myblog/internal/model"
	"myblog/log"
	"net/http"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

type LoginRequest struct {
	Name     string `json:"name"`
	Password string `json:"password"`
}

func SignIn(c *gin.Context) {
    var req LoginRequest

    // 1. 绑定前端传来的 JSON
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "无效的请求格式或缺少字段"})
        return
    }

    // 2. 去数据库中查询该用户名是否存在
    var user model.User
    // 注意：这里的 global.DB 需要换成你实际项目中初始化的 GORM 数据库实例
    result := database.DB.Where("name = ?", req.Name).First(&user)
    if result.Error != nil {
        // 安全细节：不要明确告诉前端是“账号不存在”还是“密码错误”，防止黑客撞库
        c.JSON(http.StatusUnauthorized, gin.H{"error": "用户名或密码错误"})
        return
    }
	log.Logger.Info("info", "用户名", user.Name, "psw", user.PasswordHash)
    // 3. 校验密码 (比对前端传来的明文 req.Password 和数据库里的加密 user.Password)
    err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password))
    if err != nil {
		
        c.JSON(http.StatusUnauthorized, gin.H{"error": "用户名或密码错误"})
        return
    }
	log.Logger.Info("info", "用户名", user.Name, "ID", user.ID)
    // 4. 验证通过！（后续这里将生成 JWT）
    c.JSON(http.StatusOK, gin.H{
        "message": "登录成功，欢迎回来！",
        "data": gin.H{
            "id":   user.ID,
            "name": user.Name,
        },
    })
}

func SignUp(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的请求格式或缺少字段"})
		return
	}

	user := database.AuthorCreate(req.Name, req.Password)
	if user.ID == 0 {
		c.JSON(http.StatusConflict, gin.H{"error": "用户名已存在或创建失败"})
		return
	}

	log.Logger.Info("新用户注册成功", "name", user.Name, "role", user.Role)
	c.JSON(http.StatusCreated, gin.H{
		"message": "注册成功",
		"data": gin.H{
			"id":   user.ID,
			"name": user.Name,
			"role": user.Role,
		},
	})
}

package handler

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

type LoginRequest struct {
	Name     string `json:"name"`
	Password string `json:"password"`
}

func SignIn(c *gin.Context) {
	var req LoginRequest

	// 1. 将请求体中的 JSON 数据绑定到 req 结构体
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的请求格式"})
		return
	}

	// 2. 在控制台打印接收到的内容
	fmt.Printf("收到登录请求 - 用户名: %s, 密码: %s\n", req.Name, req.Password)

	// 3. 返回响应（先返回成功，后续再写数据库逻辑）
	c.JSON(http.StatusOK, gin.H{
		"message": "接收成功",
		"data":    req,
	})
}

func SignUp(c *gin.Context) {
}

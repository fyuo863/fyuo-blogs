package router

import (
	"myblog/internal/handler"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func NewRouter() *gin.Engine {
	r := gin.New()
	r.Use(
		gin.Logger(),
		gin.Recovery(),
	)
	// 跨域中间件配置
	config := cors.DefaultConfig()
	config.AllowAllOrigins = true // 开发阶段，允许所有前端地址跨域访问
	config.AllowHeaders = []string{"Origin", "Content-Length", "Content-Type", "Authorization"}
	r.Use(cors.New(config))       // 挂载到全局路由上
	api := r.Group("/api/v1")
	{
		// 用户认证相关接口 (返回 JSON 数据)
		api.POST("/signin", handler.SignIn) // 处理登录逻辑
		//api.POST("/signup", handler.SignUp) // 处理注册逻辑

		api.GET("/articles/search", handler.SearchBlogs) // 搜索文章
		api.GET("/articles", handler.ListBlogs)
		api.GET("/articles/:id", handler.GetBlog)
		api.POST("/articles/:id/view", handler.IncrementView) // 浏览计数
		api.POST("/articles/:id/like", handler.ToggleLike)    // 点赞/取消
	}
	protected := api.Group("")
	protected.Use(
	//middleware.Auth(), //验证JWT
	) // Auth 中间件只在当前 Group 生效
	{
		// 博客文章管理 (供前端后台管理系统调用)
		protected.POST("/articles", handler.CreateBlog)       // 创建文章
		protected.PUT("/articles/:id", handler.UpdateBlog)    // 更新文章
		protected.DELETE("/articles/:id", handler.DeleteBlog) // 删除文章
	}
	return r
}

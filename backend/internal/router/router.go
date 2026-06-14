package router

import (
	"myblog/internal/handler"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type Dependencies struct {
	Articles     *handler.ArticleHandler
	Auth         *handler.AuthHandler
	Counters     *handler.CounterHandler
	VisitRecords *handler.VisitRecordHandler
	AuthTokens   gin.HandlerFunc
}

func NewRouter(deps Dependencies) *gin.Engine {
	r := gin.New()
	r.Use(
		gin.Logger(),
		gin.Recovery(),
	)

	config := cors.DefaultConfig()
	config.AllowAllOrigins = true
	config.AllowHeaders = []string{"Origin", "Content-Length", "Content-Type", "Authorization"}
	r.Use(cors.New(config))
	r.GET("/healthz", handler.Health)

	api := r.Group("/api/v1")
	{
		api.GET("/healthz", handler.Health)
		api.POST("/signin", deps.Auth.SignIn)

		api.GET("/articles/search", deps.Articles.SearchBlogs)
		api.GET("/articles", deps.Articles.ListBlogs)
		api.GET("/articles/:id", deps.Articles.GetBlog)
		api.POST("/articles/:id/view", deps.Counters.IncrementView)
		api.POST("/articles/:id/like", handler.ToggleLike)
	}

	protected := api.Group("")
	protected.Use(deps.AuthTokens)
	{
		protected.POST("/articles", deps.Articles.CreateBlog)
		protected.PUT("/articles/:id", deps.Articles.UpdateBlog)
		protected.DELETE("/articles/:id", deps.Articles.DeleteBlog)
		protected.GET("/visit-records", deps.VisitRecords.List)
	}

	return r
}

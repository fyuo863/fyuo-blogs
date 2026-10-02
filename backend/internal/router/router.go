package router

import (
	"myblog/internal/handler"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type Dependencies struct {
	Articles     *handler.ArticleHandler
	HomeContent  *handler.HomeContentHandler
	Auth         *handler.AuthHandler
	Counters     *handler.CounterHandler
	VisitRecords *handler.VisitRecordHandler
	APIKeys      *handler.APIKeyHandler
	TravelPlaces *handler.TravelPlaceHandler
	Uploads      *handler.UploadHandler
	Plugins      *handler.PluginHandler
	AuthorTokens gin.HandlerFunc
	AuthTokens   gin.HandlerFunc
	AdminTokens  gin.HandlerFunc
}

func NewRouter(deps Dependencies) *gin.Engine {
	r := gin.New()
	_ = r.SetTrustedProxies(nil)
	r.Use(
		gin.Logger(),
		gin.Recovery(),
	)
	r.Static("/uploads", "./uploads")
	r.GET("/plugin-assets/:slug/*path", deps.Plugins.Asset)

	config := cors.DefaultConfig()
	config.AllowAllOrigins = true
	config.AllowHeaders = []string{"Origin", "Content-Length", "Content-Type", "Authorization", "X-Event-Id", "X-Visitor-Id", "X-Content-Path"}
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
		api.GET("/home-content", deps.HomeContent.Get)
		api.GET("/travel-places", deps.TravelPlaces.List)
		api.GET("/plugins", deps.Plugins.List)
		api.GET("/plugins/:slug/manifest", deps.Plugins.Manifest)
	}

	authenticated := api.Group("")
	authenticated.Use(deps.AuthTokens)
	{
		authenticated.PUT("/home-content", deps.HomeContent.Update)
		authenticated.POST("/travel-places", deps.TravelPlaces.Create)
		authenticated.PUT("/travel-places/:id", deps.TravelPlaces.Update)
		authenticated.DELETE("/travel-places/:id", deps.TravelPlaces.Delete)
	}

	authorProtected := api.Group("")
	authorProtected.Use(deps.AuthorTokens)
	{
		// Authenticated probe used by MCP on every request, including existing sessions.
		authorProtected.GET("/auth/verify", func(c *gin.Context) { c.Status(204) })
		authorProtected.POST("/articles", deps.Articles.CreateBlog)
		authorProtected.PUT("/articles/:id", deps.Articles.UpdateBlog)
		authorProtected.DELETE("/articles/:id", deps.Articles.DeleteBlog)
	}

	adminProtected := api.Group("")
	adminProtected.Use(deps.AdminTokens)
	{
		// Uploaded executable/page assets are an administrative capability; agents
		// may publish articles but cannot change the site's executable surface.
		adminProtected.POST("/uploads/images", deps.Uploads.UploadImage)
		adminProtected.GET("/admin/plugins", deps.Plugins.AdminList)
		adminProtected.PUT("/admin/plugins/order", deps.Plugins.SetOrder)
		adminProtected.POST("/admin/plugins", deps.Plugins.Upload)
		adminProtected.POST("/admin/plugins/:slug/publish/:version", deps.Plugins.Publish)
		adminProtected.POST("/admin/plugins/:slug/disable", deps.Plugins.Disable)
		adminProtected.GET("/visit-records", deps.VisitRecords.List)
		adminProtected.GET("/admin/publisher-users", deps.APIKeys.ListPublisherUsers)
		adminProtected.GET("/admin/api-keys", deps.APIKeys.List)
		adminProtected.POST("/admin/api-keys", deps.APIKeys.Create)
		adminProtected.PATCH("/admin/api-keys/:id", deps.APIKeys.Update)
		adminProtected.POST("/admin/api-keys/:id/rotate", deps.APIKeys.Rotate)
		adminProtected.DELETE("/admin/api-keys/:id", deps.APIKeys.Delete)
	}

	return r
}

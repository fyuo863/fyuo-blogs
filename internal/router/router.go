package router

import (
	"myblog/internal/handler"

	"github.com/gin-gonic/gin"
)

func NewRouter() *gin.Engine {
	r := gin.New()
	r.Use(
		gin.Logger(),
		gin.Recovery(),
	)
	test := r.Group("")
	{
		test.GET("/test", handler.Test)
	}

	return r
}

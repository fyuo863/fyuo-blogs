package handler

import (
	"context"
	"myblog/internal/database"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func Health(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 2*time.Second)
	defer cancel()

	status := gin.H{"status": "ok"}
	code := http.StatusOK

	if database.DB == nil {
		status["postgres"] = "not_initialized"
		code = http.StatusServiceUnavailable
	} else if sqlDB, err := database.DB.DB(); err != nil {
		status["postgres"] = "unavailable"
		code = http.StatusServiceUnavailable
	} else if err := sqlDB.PingContext(ctx); err != nil {
		status["postgres"] = "unhealthy"
		code = http.StatusServiceUnavailable
	} else {
		status["postgres"] = "ok"
	}

	if database.RDB == nil {
		status["redis"] = "not_initialized"
		code = http.StatusServiceUnavailable
	} else if err := database.RDB.Ping(ctx).Err(); err != nil {
		status["redis"] = "unhealthy"
		code = http.StatusServiceUnavailable
	} else {
		status["redis"] = "ok"
	}

	if code != http.StatusOK {
		status["status"] = "degraded"
	}
	c.JSON(code, status)
}

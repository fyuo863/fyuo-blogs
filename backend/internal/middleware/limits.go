package middleware

import (
	"bytes"
	"github.com/gin-gonic/gin"
	"io"
	"net/http"
)

// Enforce before JSON binding, including chunked requests. Uploads stream under
// their own limits; never buffer an entire plugin ZIP here.
func BodyLimit() gin.HandlerFunc {
	return func(c *gin.Context) {
		limit := int64(1 << 20)
		switch c.Request.URL.Path {
		case "/api/v1/admin/plugins":
			limit = 33 << 20
		case "/api/v1/uploads/images":
			limit = 9 << 20
		case "/api/v1/signin":
			limit = 4096
		}
		if c.Request.ContentLength > limit {
			c.AbortWithStatus(413)
			return
		}
		c.Request.Body = http.MaxBytesReader(c.Writer, c.Request.Body, limit)
		if limit <= 1<<20 && c.Request.Body != nil {
			data, err := io.ReadAll(c.Request.Body)
			if err != nil {
				c.AbortWithStatus(413)
				return
			}
			c.Request.Body = io.NopCloser(bytes.NewReader(data))
		}
		c.Next()
	}
}

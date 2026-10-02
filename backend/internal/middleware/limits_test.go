package middleware

import (
	"github.com/gin-gonic/gin"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestBodyLimit(t *testing.T) {
	gin.SetMode(gin.TestMode)
	r := gin.New()
	r.Use(BodyLimit())
	r.POST("/api/v1/signin", func(c *gin.Context) { c.Status(204) })
	for _, chunked := range []bool{false, true} {
		req := httptest.NewRequest("POST", "/api/v1/signin", strings.NewReader(strings.Repeat("x", 4097)))
		if chunked {
			req.ContentLength = -1
		}
		w := httptest.NewRecorder()
		r.ServeHTTP(w, req)
		if w.Code != 413 {
			t.Fatalf("got %d", w.Code)
		}
	}
}

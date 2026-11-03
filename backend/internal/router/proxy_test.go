package router

import (
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
)

func TestForwardedClientIPRequiresTrustedPeer(t *testing.T) {
	for _, tc := range []struct{ name, trusted, peer, real, expected string }{
		{"default ignores spoofed headers", "", "203.0.113.2:1234", "198.51.100.9", "203.0.113.2"},
		{"proxy forwards real address", "172.19.0.0/16", "172.19.0.7:1234", "198.51.100.9", "198.51.100.9"},
		{"untrusted peer ignored", "172.19.0.0/16", "203.0.113.2:1234", "198.51.100.9", "203.0.113.2"},
		{"invalid real address ignored", "172.19.0.0/16", "172.19.0.7:1234", "invalid", "172.19.0.7"},
		{"ipv6 client", "172.19.0.0/16", "172.19.0.7:1234", "2001:db8::1", "2001:db8::1"},
	} {
		t.Run(tc.name, func(t *testing.T) {
			t.Setenv("TRUSTED_PROXY_CIDRS", tc.trusted)
			r := gin.New()
			if err := configureTrustedProxies(r); err != nil {
				t.Fatal(err)
			}
			r.GET("/", func(c *gin.Context) { c.String(200, c.ClientIP()) })
			req := httptest.NewRequest("GET", "/", nil)
			req.RemoteAddr = tc.peer
			req.Header.Set("X-Real-IP", tc.real)
			req.Header.Set("X-Forwarded-For", "192.0.2.99")
			response := httptest.NewRecorder()
			r.ServeHTTP(response, req)
			if response.Body.String() != tc.expected {
				t.Fatalf("IP=%s want=%s", response.Body, tc.expected)
			}
		})
	}
	t.Setenv("TRUSTED_PROXY_CIDRS", "not-a-cidr")
	if configureTrustedProxies(gin.New()) == nil {
		t.Fatal("bad proxy configuration accepted")
	}
}

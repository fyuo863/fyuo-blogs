package handler

import (
	"encoding/json"
	"errors"
	"github.com/gin-gonic/gin"
	"myblog/internal/middleware"
	"myblog/internal/service"
	"os"
	"path/filepath"
	"strings"
)

type PluginHandler struct{ svc *service.PluginService }

func NewPluginHandler(svc *service.PluginService) *PluginHandler { return &PluginHandler{svc: svc} }
func (h *PluginHandler) List(c *gin.Context) {
	p, e := h.svc.List()
	if e != nil {
		c.JSON(500, gin.H{"error": "查询插件失败"})
		return
	}
	c.JSON(200, gin.H{"data": p})
}
func (h *PluginHandler) Manifest(c *gin.Context) {
	_, v, e := h.svc.Active(c.Param("slug"))
	if e != nil {
		c.JSON(404, gin.H{"error": "插件不可用"})
		return
	}
	var m interface{}
	if json.Unmarshal([]byte(v.ManifestJSON), &m) != nil {
		c.JSON(500, gin.H{"error": "插件清单损坏"})
		return
	}
	c.JSON(200, gin.H{"data": m})
}
func (h *PluginHandler) Asset(c *gin.Context) {
	_, v, e := h.svc.Active(c.Param("slug"))
	if e != nil {
		c.Status(404)
		return
	}
	raw := strings.TrimPrefix(c.Param("path"), "/")
	parts := strings.SplitN(raw, "/", 2)
	if len(parts) != 2 || parts[0] != v.Version {
		c.Status(404)
		return
	}
	p := filepath.Join(v.StoragePath, filepath.FromSlash(parts[1]))
	rel, e := filepath.Rel(v.StoragePath, p)
	if e != nil || strings.HasPrefix(rel, "..") || filepath.IsAbs(rel) {
		c.Status(404)
		return
	}
	if st, e := os.Stat(p); e != nil || st.IsDir() {
		c.Status(404)
		return
	}
	c.Header("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self'; frame-ancestors 'self'")
	c.File(p)
}
func (h *PluginHandler) Upload(c *gin.Context) {
	claims, ok := middleware.Claims(c)
	if !ok {
		c.Status(401)
		return
	}
	f, e := c.FormFile("file")
	if e != nil {
		c.JSON(400, gin.H{"error": "缺少插件 ZIP"})
		return
	}
	tmp, e := os.CreateTemp("", "plugin-upload-*.zip")
	if e != nil {
		c.Status(500)
		return
	}
	tmp.Close()
	defer os.Remove(tmp.Name())
	if e = c.SaveUploadedFile(f, tmp.Name()); e != nil {
		c.Status(500)
		return
	}
	v, e := h.svc.Upload(tmp.Name(), claims.UserID)
	if errors.Is(e, service.ErrInvalidPlugin) {
		c.JSON(400, gin.H{"error": "插件包无效"})
		return
	}
	if e != nil {
		c.JSON(500, gin.H{"error": "上传插件失败"})
		return
	}
	c.JSON(201, gin.H{"data": v})
}
func (h *PluginHandler) Publish(c *gin.Context) {
	if e := h.svc.Publish(c.Param("slug"), c.Param("version")); e != nil {
		c.JSON(400, gin.H{"error": "发布失败"})
		return
	}
	c.JSON(200, gin.H{"message": "发布成功"})
}
func (h *PluginHandler) Disable(c *gin.Context) {
	if e := h.svc.Disable(c.Param("slug")); e != nil {
		c.JSON(404, gin.H{"error": "插件不存在"})
		return
	}
	c.JSON(200, gin.H{"message": "已下线"})
}

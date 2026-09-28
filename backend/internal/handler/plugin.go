package handler

import (
	"encoding/json"
	"errors"
	"github.com/gin-gonic/gin"
	"mime"
	"myblog/internal/middleware"
	"myblog/internal/repository"
	"myblog/internal/service"
	"net/http"
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
	raw := strings.TrimPrefix(c.Param("path"), "/")
	parts := strings.SplitN(raw, "/", 2)
	if len(parts) != 2 {
		c.Status(404)
		return
	}
	v, e := h.svc.AssetVersion(c.Param("slug"), parts[0])
	if e != nil {
		c.Status(404)
		return
	}
	p := filepath.Join(v.StoragePath, filepath.FromSlash(parts[1]))
	rel, e := filepath.Rel(v.StoragePath, p)
	if e != nil || strings.HasPrefix(rel, "..") || filepath.IsAbs(rel) {
		c.Status(404)
		return
	}
	st, e := os.Stat(p)
	if e != nil || st.IsDir() {
		c.Status(404)
		return
	}
	c.Header("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self'; frame-ancestors 'self'")
	c.Header("X-Content-Type-Options", "nosniff")
	c.Header("Cache-Control", "no-cache")
	f, err := os.Open(p)
	if err != nil {
		c.Status(404)
		return
	}
	defer f.Close()
	contentType := mime.TypeByExtension(filepath.Ext(p))
	if filepath.Ext(p) == ".js" {
		contentType = "text/javascript; charset=utf-8"
	}
	if filepath.Ext(p) == ".css" {
		contentType = "text/css; charset=utf-8"
	}
	if contentType == "" {
		contentType = "application/octet-stream"
	}
	c.DataFromReader(http.StatusOK, st.Size(), contentType, f, nil)
}
func (h *PluginHandler) Upload(c *gin.Context) {
	c.Request.Body = http.MaxBytesReader(c.Writer, c.Request.Body, 33<<20)
	claims, ok := middleware.Claims(c)
	if !ok {
		c.Status(401)
		return
	}
	f, e := c.FormFile("file")
	if c.Request.MultipartForm != nil {
		defer c.Request.MultipartForm.RemoveAll()
	}
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
	if errors.Is(e, service.ErrPluginVersionExists) {
		c.JSON(409, gin.H{"error": "该版本已存在，请修改版本号后重新上传"})
		return
	}
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

func (h *PluginHandler) AdminList(c *gin.Context) {
	plugins, err := h.svc.ListAll()
	if err != nil {
		c.JSON(500, gin.H{"error": "查询插件失败"})
		return
	}
	c.JSON(200, gin.H{"data": plugins})
}
func (h *PluginHandler) SetOrder(c *gin.Context) {
	c.Request.Body = http.MaxBytesReader(c.Writer, c.Request.Body, 128<<10)
	var request struct {
		Slugs []string `json:"slugs"`
	}
	if c.ShouldBindJSON(&request) != nil || request.Slugs == nil {
		c.JSON(400, gin.H{"error": "请提交完整的插件顺序"})
		return
	}
	if err := h.svc.SetOrder(request.Slugs); err != nil {
		if errors.Is(err, repository.ErrPluginOrderConflict) {
			c.JSON(409, gin.H{"error": "插件列表已变化或顺序无效，请刷新后重试"})
			return
		}
		c.JSON(500, gin.H{"error": "保存顺序失败"})
		return
	}
	c.JSON(200, gin.H{"message": "顺序已保存"})
}

package handler

import (
	"fmt"
	_ "golang.org/x/image/webp"
	"image"
	_ "image/gif"
	_ "image/jpeg"
	_ "image/png"
	"mime/multipart"
	"myblog/log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

const uploadDir = "uploads"

type UploadHandler struct{}

func NewUploadHandler() *UploadHandler {
	return &UploadHandler{}
}

func (h *UploadHandler) UploadImage(c *gin.Context) {
	c.Request.Body = http.MaxBytesReader(c.Writer, c.Request.Body, 9<<20)
	file, err := c.FormFile("file")
	if c.Request.MultipartForm != nil {
		defer c.Request.MultipartForm.RemoveAll()
	}
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "缺少图片文件"})
		return
	}
	if !isAllowedImage(file) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "仅支持 jpg、jpeg、png、gif、webp"})
		return
	}
	if err := os.MkdirAll(uploadDir, 0o755); err != nil {
		log.Logger.Error("创建上传目录失败", "error", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "创建上传目录失败"})
		return
	}

	filename := buildUploadFilename(file.Filename)
	targetPath := filepath.Join(uploadDir, filename)
	if err := c.SaveUploadedFile(file, targetPath); err != nil {
		log.Logger.Error("保存上传图片失败", "error", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "保存图片失败"})
		return
	}

	url := fmt.Sprintf("/uploads/%s", filename)
	c.JSON(http.StatusCreated, gin.H{
		"data": gin.H{
			"url":  url,
			"name": filename,
			"size": file.Size,
		},
	})
}

func isAllowedImage(file *multipart.FileHeader) bool {
	if file.Size <= 0 || file.Size > 8<<20 {
		return false
	}
	f, err := file.Open()
	if err != nil {
		return false
	}
	defer f.Close()
	cfg, format, err := image.DecodeConfig(f)
	if err != nil || cfg.Width <= 0 || cfg.Height <= 0 || int64(cfg.Width)*int64(cfg.Height) > 24_000_000 {
		return false
	}
	ext := strings.ToLower(filepath.Ext(file.Filename))
	if ext == ".jpg" {
		ext = ".jpeg"
	}
	return ext == "."+format
}

func buildUploadFilename(original string) string {
	ext := strings.ToLower(filepath.Ext(original))
	base := strings.TrimSuffix(filepath.Base(original), filepath.Ext(original))
	base = strings.TrimSpace(base)
	base = strings.ReplaceAll(base, " ", "-")
	if base == "" {
		base = "image"
	}
	return fmt.Sprintf("%d-%s%s", time.Now().UnixNano(), base, ext)
}

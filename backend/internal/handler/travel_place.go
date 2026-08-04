package handler

import (
	"errors"
	"myblog/internal/middleware"
	"myblog/internal/model"
	"myblog/internal/service"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type TravelPlaceHandler struct {
	places *service.TravelPlaceService
}

func NewTravelPlaceHandler(places *service.TravelPlaceService) *TravelPlaceHandler {
	return &TravelPlaceHandler{places: places}
}

func (h *TravelPlaceHandler) List(c *gin.Context) {
	places, err := h.places.List(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "读取旅行地点失败"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": places})
}

func (h *TravelPlaceHandler) Create(c *gin.Context) {
	var req service.TravelPlaceInput
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的旅行地点格式"})
		return
	}
	actor, ok := travelPlaceActor(c)
	if !ok {
		return
	}
	place, err := h.places.Create(c.Request.Context(), actor, req)
	h.writeMutation(c, place, err, http.StatusCreated)
}

func (h *TravelPlaceHandler) Update(c *gin.Context) {
	id, ok := parseTravelPlaceID(c)
	if !ok {
		return
	}
	var req service.TravelPlaceInput
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的旅行地点格式"})
		return
	}
	actor, ok := travelPlaceActor(c)
	if !ok {
		return
	}
	place, err := h.places.Update(c.Request.Context(), actor, id, req)
	h.writeMutation(c, place, err, http.StatusOK)
}

func (h *TravelPlaceHandler) Delete(c *gin.Context) {
	id, ok := parseTravelPlaceID(c)
	if !ok {
		return
	}
	actor, ok := travelPlaceActor(c)
	if !ok {
		return
	}
	err := h.places.Delete(c.Request.Context(), actor, id)
	if errors.Is(err, service.ErrTravelPlaceNotFound) {
		c.JSON(http.StatusNotFound, gin.H{"error": "旅行地点不存在"})
		return
	}
	if errors.Is(err, service.ErrTravelPlaceForbidden) {
		c.JSON(http.StatusForbidden, gin.H{"error": "无权修改该旅行地点"})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "删除旅行地点失败"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "旅行地点已删除"})
}

func (h *TravelPlaceHandler) writeMutation(c *gin.Context, place service.TravelPlaceView, err error, status int) {
	if errors.Is(err, service.ErrTravelPlaceInvalid) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "地点名称、经纬度、图集或路径点格式无效"})
		return
	}
	if errors.Is(err, service.ErrTravelPlaceNotFound) {
		c.JSON(http.StatusNotFound, gin.H{"error": "旅行地点不存在"})
		return
	}
	if errors.Is(err, service.ErrTravelPlaceForbidden) {
		c.JSON(http.StatusForbidden, gin.H{"error": "无权修改该旅行地点"})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "保存旅行地点失败"})
		return
	}
	c.JSON(status, gin.H{"data": place})
}

func travelPlaceActor(c *gin.Context) (model.User, bool) {
	claims, ok := middleware.Claims(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "身份验证失败"})
		return model.User{}, false
	}
	return model.User{ID: claims.UserID, Name: claims.Name, Role: claims.Role}, true
}

func parseTravelPlaceID(c *gin.Context) (uint, bool) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的旅行地点 ID"})
		return 0, false
	}
	return uint(id), true
}

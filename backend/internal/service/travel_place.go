package service

import (
	"context"
	"encoding/json"
	"errors"
	"math"
	"myblog/internal/model"
	"myblog/internal/repository"
	"strings"
	"time"

	"gorm.io/gorm"
)

var (
	ErrTravelPlaceInvalid   = errors.New("invalid travel place")
	ErrTravelPlaceNotFound  = errors.New("travel place not found")
	ErrTravelPlaceForbidden = errors.New("travel place forbidden")
)

type GeoPoint struct {
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
}

type TravelPlaceInput struct {
	Name      string     `json:"name"`
	Latitude  float64    `json:"latitude"`
	Longitude float64    `json:"longitude"`
	Gallery   []string   `json:"gallery"`
	Route     []GeoPoint `json:"route"`
}

type TravelPlaceView struct {
	ID        uint       `json:"id"`
	Name      string     `json:"name"`
	Latitude  float64    `json:"latitude"`
	Longitude float64    `json:"longitude"`
	Gallery   []string   `json:"gallery"`
	Route     []GeoPoint `json:"route"`
	AuthorID  uint       `json:"author_id"`
	CreatedAt time.Time  `json:"created_at"`
	UpdatedAt time.Time  `json:"updated_at"`
}

type TravelPlaceService struct {
	places *repository.TravelPlaceRepository
}

func NewTravelPlaceService(places *repository.TravelPlaceRepository) *TravelPlaceService {
	return &TravelPlaceService{places: places}
}

func (s *TravelPlaceService) List(ctx context.Context) ([]TravelPlaceView, error) {
	places, err := s.places.List()
	if err != nil {
		return nil, err
	}
	result := make([]TravelPlaceView, 0, len(places))
	for _, place := range places {
		view, err := travelPlaceView(place)
		if err != nil {
			return nil, err
		}
		result = append(result, view)
	}
	return result, nil
}

func (s *TravelPlaceService) Create(ctx context.Context, actor model.User, input TravelPlaceInput) (TravelPlaceView, error) {
	normalized, err := normalizeTravelPlaceInput(input)
	if err != nil {
		return TravelPlaceView{}, err
	}
	gallery, _ := json.Marshal(normalized.Gallery)
	route, _ := json.Marshal(normalized.Route)
	place := model.TravelPlace{
		Name:        normalized.Name,
		Latitude:    normalized.Latitude,
		Longitude:   normalized.Longitude,
		GalleryJSON: string(gallery),
		RouteJSON:   string(route),
		AuthorID:    actor.ID,
	}
	if err := s.places.Create(&place); err != nil {
		return TravelPlaceView{}, err
	}
	return travelPlaceView(place)
}

func (s *TravelPlaceService) Update(ctx context.Context, actor model.User, id uint, input TravelPlaceInput) (TravelPlaceView, error) {
	place, err := s.places.FindByID(id)
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return TravelPlaceView{}, ErrTravelPlaceNotFound
	}
	if err != nil {
		return TravelPlaceView{}, err
	}
	if actor.Role != "admin" && place.AuthorID != actor.ID {
		return TravelPlaceView{}, ErrTravelPlaceForbidden
	}
	normalized, err := normalizeTravelPlaceInput(input)
	if err != nil {
		return TravelPlaceView{}, err
	}
	gallery, _ := json.Marshal(normalized.Gallery)
	route, _ := json.Marshal(normalized.Route)
	place.Name = normalized.Name
	place.Latitude = normalized.Latitude
	place.Longitude = normalized.Longitude
	place.GalleryJSON = string(gallery)
	place.RouteJSON = string(route)
	if err := s.places.Save(&place); err != nil {
		return TravelPlaceView{}, err
	}
	return travelPlaceView(place)
}

func (s *TravelPlaceService) Delete(ctx context.Context, actor model.User, id uint) error {
	place, err := s.places.FindByID(id)
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return ErrTravelPlaceNotFound
	}
	if err != nil {
		return err
	}
	if actor.Role != "admin" && place.AuthorID != actor.ID {
		return ErrTravelPlaceForbidden
	}
	return s.places.Delete(place.ID)
}

func normalizeTravelPlaceInput(input TravelPlaceInput) (TravelPlaceInput, error) {
	input.Name = strings.TrimSpace(input.Name)
	if input.Name == "" || len(input.Name) > 160 || !validCoordinates(input.Latitude, input.Longitude) || len(input.Gallery) > 18 || len(input.Route) > 160 {
		return TravelPlaceInput{}, ErrTravelPlaceInvalid
	}
	gallery := make([]string, 0, len(input.Gallery))
	for _, image := range input.Gallery {
		image = strings.TrimSpace(image)
		if image == "" {
			continue
		}
		gallery = append(gallery, image)
	}
	for _, point := range input.Route {
		if !validCoordinates(point.Latitude, point.Longitude) {
			return TravelPlaceInput{}, ErrTravelPlaceInvalid
		}
	}
	input.Gallery = gallery
	if input.Route == nil {
		input.Route = []GeoPoint{}
	}
	return input, nil
}

func validCoordinates(latitude, longitude float64) bool {
	return !math.IsNaN(latitude) && !math.IsNaN(longitude) &&
		!math.IsInf(latitude, 0) && !math.IsInf(longitude, 0) &&
		latitude >= -90 && latitude <= 90 &&
		longitude >= -180 && longitude <= 180
}

func travelPlaceView(place model.TravelPlace) (TravelPlaceView, error) {
	gallery := []string{}
	route := []GeoPoint{}
	if err := json.Unmarshal([]byte(place.GalleryJSON), &gallery); err != nil {
		return TravelPlaceView{}, err
	}
	if err := json.Unmarshal([]byte(place.RouteJSON), &route); err != nil {
		return TravelPlaceView{}, err
	}
	return TravelPlaceView{
		ID:        place.ID,
		Name:      place.Name,
		Latitude:  place.Latitude,
		Longitude: place.Longitude,
		Gallery:   gallery,
		Route:     route,
		AuthorID:  place.AuthorID,
		CreatedAt: place.CreatedAt,
		UpdatedAt: place.UpdatedAt,
	}, nil
}

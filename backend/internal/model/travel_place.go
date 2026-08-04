package model

import "time"

// TravelPlace stores a point on the personal travel globe and its optional media and route data.
type TravelPlace struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	Name        string    `gorm:"type:varchar(160);not null" json:"name"`
	Latitude    float64   `gorm:"not null" json:"latitude"`
	Longitude   float64   `gorm:"not null" json:"longitude"`
	GalleryJSON string    `gorm:"type:jsonb;not null" json:"-"`
	RouteJSON   string    `gorm:"type:jsonb;not null" json:"-"`
	AuthorID    uint      `gorm:"index;not null" json:"author_id"`
	Author      User      `gorm:"foreignKey:AuthorID" json:"author"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

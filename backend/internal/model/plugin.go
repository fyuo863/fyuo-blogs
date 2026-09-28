package model

import "time"

type Plugin struct {
	SortOrder      int             `gorm:"not null;default:1000;index" json:"sort_order"`
	ID             uint            `gorm:"primaryKey" json:"id"`
	Slug           string          `gorm:"type:varchar(80);uniqueIndex;not null" json:"slug"`
	Name           string          `gorm:"type:varchar(160);not null" json:"name"`
	Type           string          `gorm:"type:varchar(20);not null" json:"type"`
	Status         string          `gorm:"type:varchar(20);not null;index" json:"status"`
	ActiveVersion  string          `gorm:"type:varchar(80)" json:"active_version,omitempty"`
	CreatedBy      uint            `gorm:"not null" json:"created_by"`
	ManagedByAdmin bool            `gorm:"not null;default:false" json:"managed_by_admin"`
	CreatedAt      time.Time       `json:"created_at"`
	UpdatedAt      time.Time       `json:"updated_at"`
	Versions       []PluginVersion `json:"versions,omitempty"`
}

type PluginVersion struct {
	ID           uint       `gorm:"primaryKey" json:"id"`
	PluginID     uint       `gorm:"uniqueIndex:idx_plugin_version;not null" json:"plugin_id"`
	Version      string     `gorm:"type:varchar(80);uniqueIndex:idx_plugin_version;not null" json:"version"`
	ManifestJSON string     `gorm:"type:jsonb;not null" json:"manifest_json"`
	StoragePath  string     `gorm:"type:text;not null" json:"-"`
	ContentHash  string     `gorm:"type:char(64);not null" json:"content_hash"`
	Status       string     `gorm:"type:varchar(20);not null;index" json:"status"`
	CreatedBy    uint       `gorm:"not null" json:"created_by"`
	PublishedAt  *time.Time `json:"published_at,omitempty"`
	CreatedAt    time.Time  `json:"created_at"`
}

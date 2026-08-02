package model

import "time"

// HomeContent stores the single editable configuration backing the home page.
type HomeContent struct {
	ID               uint      `gorm:"primaryKey" json:"id"`
	CoverImage       string    `gorm:"type:text;not null" json:"cover_image"`
	CoverTitle       string    `gorm:"type:varchar(255);not null" json:"cover_title"`
	CoverGitHubURL   string    `gorm:"type:text" json:"cover_github_url"`
	CoverDescription string    `gorm:"type:text" json:"cover_description"`
	ProjectsJSON     string    `gorm:"type:jsonb;not null" json:"-"`
	UpdatedAt        time.Time `json:"updated_at"`
}

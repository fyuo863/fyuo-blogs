package repository

import (
	"encoding/json"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
	"myblog/internal/model"
)

type PluginRepository struct{ db *gorm.DB }

func NewPluginRepository(db *gorm.DB) *PluginRepository { return &PluginRepository{db: db} }
func (r *PluginRepository) FindOrCreate(slug, name, typ string, actor uint) (model.Plugin, error) {
	var p model.Plugin
	err := r.db.Where("slug = ?", slug).First(&p).Error
	if err == nil {
		return p, nil
	}
	if err != gorm.ErrRecordNotFound {
		return p, err
	}
	p = model.Plugin{Slug: slug, Name: name, Type: typ, Status: "draft", CreatedBy: actor}
	err = r.db.Create(&p).Error
	return p, err
}
func (r *PluginRepository) SaveVersion(v *model.PluginVersion) error { return r.db.Create(v).Error }
func (r *PluginRepository) Version(slug, version string) (model.PluginVersion, error) {
	var v model.PluginVersion
	err := r.db.Joins("JOIN plugins ON plugins.id = plugin_versions.plugin_id").Where("plugins.slug = ? AND plugin_versions.version = ?", slug, version).First(&v).Error
	return v, err
}
func (r *PluginRepository) Active(slug string) (model.Plugin, model.PluginVersion, error) {
	var p model.Plugin
	if err := r.db.Where("slug = ? AND status = ? AND active_version <> ''", slug, "published").First(&p).Error; err != nil {
		return p, model.PluginVersion{}, err
	}
	v, err := r.Version(slug, p.ActiveVersion)
	return p, v, err
}
func (r *PluginRepository) ListPublished() ([]model.Plugin, error) {
	var p []model.Plugin
	err := r.db.Where("status = ?", "published").Order("updated_at DESC").Find(&p).Error
	return p, err
}
func (r *PluginRepository) Publish(slug, version string) error {
	return r.publish(slug, version, true)
}
func (r *PluginRepository) PublishBuiltin(slug, version string) error {
	return r.publish(slug, version, false)
}
func (r *PluginRepository) publish(slug, version string, manual bool) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		var p model.Plugin
		if err := tx.Clauses(clause.Locking{Strength: "UPDATE"}).Where("slug = ?", slug).First(&p).Error; err != nil {
			return err
		}
		if !manual && (p.ManagedByAdmin || p.CreatedBy != 0 || p.Status == "disabled") {
			return nil
		}
		var v model.PluginVersion
		if err := tx.Where("plugin_id = ? AND version = ?", p.ID, version).First(&v).Error; err != nil {
			return err
		}
		if err := tx.Model(&v).Updates(map[string]interface{}{"status": "published", "published_at": gorm.Expr("CURRENT_TIMESTAMP")}).Error; err != nil {
			return err
		}
		var manifest struct {
			Name string `json:"name"`
			Type string `json:"type"`
		}
		if err := json.Unmarshal([]byte(v.ManifestJSON), &manifest); err != nil {
			return err
		}
		return tx.Model(&p).Updates(map[string]interface{}{"status": "published", "active_version": version, "name": manifest.Name, "type": manifest.Type, "managed_by_admin": manual}).Error
	})
}
func (r *PluginRepository) SetStatus(slug, status string) error {
	result := r.db.Model(&model.Plugin{}).Where("slug = ?", slug).Updates(map[string]interface{}{"status": status, "managed_by_admin": true})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}
	return nil
}

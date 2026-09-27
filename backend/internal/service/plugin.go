package service

import (
	"archive/zip"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"myblog/internal/model"
	"myblog/internal/repository"
	"os"
	"path/filepath"
	"regexp"
	"strings"
)

var ErrInvalidPlugin = errors.New("invalid plugin package")
var safePluginPart = regexp.MustCompile(`^[a-z0-9][a-z0-9._-]{0,79}$`)

type PluginManifest struct {
	ID         string `json:"id"`
	Name       string `json:"name"`
	Version    string `json:"version"`
	Route      string `json:"route"`
	Entry      string `json:"entry"`
	Type       string `json:"type"`
	Enabled    bool   `json:"enabled"`
	Navigation struct {
		Label string `json:"label"`
		Order int    `json:"order"`
	} `json:"navigation"`
	Permissions []string `json:"permissions"`
}
type PluginService struct {
	repo *repository.PluginRepository
	root string
}

func NewPluginService(repo *repository.PluginRepository, root string) *PluginService {
	return &PluginService{repo: repo, root: root}
}

func ValidatePluginManifest(m PluginManifest) error {
	entry := filepath.ToSlash(m.Entry)
	if !safePluginPart.MatchString(m.ID) || !safePluginPart.MatchString(m.Version) || m.Name == "" || m.Type != "iframe" || m.Entry == "" || filepath.IsAbs(m.Entry) || strings.HasPrefix(entry, "/") || strings.Contains(entry, "..") {
		return ErrInvalidPlugin
	}
	return nil
}
func (s *PluginService) Upload(path string, actor uint) (model.PluginVersion, error) {
	r, err := zip.OpenReader(path)
	if err != nil {
		return model.PluginVersion{}, err
	}
	defer r.Close()
	if len(r.File) > 200 {
		return model.PluginVersion{}, ErrInvalidPlugin
	}
	if info, err := os.Stat(path); err != nil || info.Size() > 32<<20 {
		return model.PluginVersion{}, ErrInvalidPlugin
	}
	var manifest PluginManifest
	var raw []byte
	found := false
	for _, f := range r.File {
		if f.FileInfo().IsDir() {
			continue
		}
		if f.UncompressedSize64 > 8<<20 || len(strings.Split(filepath.ToSlash(f.Name), "/")) > 8 {
			return model.PluginVersion{}, ErrInvalidPlugin
		}
		if strings.Contains(filepath.ToSlash(f.Name), "..") || filepath.IsAbs(f.Name) || len(f.Name) > 240 {
			return model.PluginVersion{}, ErrInvalidPlugin
		}
		if f.Name == "manifest.json" {
			if f.UncompressedSize64 > 64*1024 {
				return model.PluginVersion{}, ErrInvalidPlugin
			}
			rc, e := f.Open()
			if e != nil {
				return model.PluginVersion{}, e
			}
			raw, e = io.ReadAll(rc)
			rc.Close()
			if e != nil {
				return model.PluginVersion{}, e
			}
			if json.Unmarshal(raw, &manifest) != nil {
				return model.PluginVersion{}, ErrInvalidPlugin
			}
			found = true
		}
	}
	if !found || ValidatePluginManifest(manifest) != nil {
		return model.PluginVersion{}, ErrInvalidPlugin
	}
	p, err := s.repo.FindOrCreate(manifest.ID, manifest.Name, manifest.Type, actor)
	if err != nil {
		return model.PluginVersion{}, err
	}
	if err := os.MkdirAll(s.root, 0755); err != nil {
		return model.PluginVersion{}, err
	}
	tmp, err := os.MkdirTemp(s.root, ".plugin-")
	if err != nil {
		return model.PluginVersion{}, err
	}
	defer os.RemoveAll(tmp)
	entryFound := false
	h := sha256.New()
	for _, f := range r.File {
		if f.FileInfo().IsDir() {
			continue
		}
		target := filepath.Join(tmp, filepath.FromSlash(f.Name))
		if rel, e := filepath.Rel(tmp, target); e != nil || strings.HasPrefix(rel, "..") || filepath.IsAbs(rel) {
			return model.PluginVersion{}, ErrInvalidPlugin
		}
		if filepath.ToSlash(f.Name) == manifest.Entry {
			entryFound = true
		}
		if err := os.MkdirAll(filepath.Dir(target), 0755); err != nil {
			return model.PluginVersion{}, err
		}
		rc, e := f.Open()
		if e != nil {
			return model.PluginVersion{}, e
		}
		out, e := os.OpenFile(target, os.O_CREATE|os.O_WRONLY|os.O_TRUNC, 0644)
		if e == nil {
			_, e = io.Copy(io.MultiWriter(out, h), rc)
		}
		out.Close()
		rc.Close()
		if e != nil {
			return model.PluginVersion{}, e
		}
	}
	if !entryFound {
		return model.PluginVersion{}, ErrInvalidPlugin
	}
	dest := filepath.Join(s.root, manifest.ID, manifest.Version)
	if _, e := os.Stat(dest); e == nil {
		return model.PluginVersion{}, fmt.Errorf("plugin version exists")
	}
	if err := os.MkdirAll(filepath.Dir(dest), 0755); err != nil {
		return model.PluginVersion{}, err
	}
	if err := os.Rename(tmp, dest); err != nil {
		return model.PluginVersion{}, err
	}
	v := model.PluginVersion{PluginID: p.ID, Version: manifest.Version, ManifestJSON: string(raw), StoragePath: dest, ContentHash: hex.EncodeToString(h.Sum(nil)), Status: "draft", CreatedBy: actor}
	if err := s.repo.SaveVersion(&v); err != nil {
		os.RemoveAll(dest)
		return model.PluginVersion{}, err
	}
	return v, nil
}
func (s *PluginService) Publish(slug, version string) error { return s.repo.Publish(slug, version) }
func (s *PluginService) Disable(slug string) error          { return s.repo.SetStatus(slug, "disabled") }
func (s *PluginService) List() ([]model.Plugin, error)      { return s.repo.ListPublished() }
func (s *PluginService) Active(slug string) (model.Plugin, model.PluginVersion, error) {
	return s.repo.Active(slug)
}

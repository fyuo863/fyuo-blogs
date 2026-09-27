package handler

import (
	"archive/zip"
	"encoding/json"
	"fmt"
	"io"
	"net/http/httptest"
	"os"
	"path/filepath"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
	"myblog/internal/model"
	"myblog/internal/repository"
	"myblog/internal/service"
)

// Uses only a disposable local database; never reads application credentials.
func pluginTestDB(t *testing.T) *gorm.DB {
	t.Helper()
	if os.Getenv("BLOG_PLUGIN_INTEGRATION") != "1" {
		t.Skip("requires disposable PostgreSQL on 127.0.0.1:15449")
	}
	dsn := "host=127.0.0.1 port=15449 user=plugin_test password=local-test-only dbname=plugin_test sslmode=disable"
	config := &gorm.Config{Logger: logger.Default.LogMode(logger.Silent)}
	db, err := gorm.Open(postgres.Open(dsn), config)
	if err != nil {
		t.Fatal(err)
	}
	schema := fmt.Sprintf("plugin_%d", time.Now().UnixNano())
	if err = db.Exec("CREATE SCHEMA " + schema).Error; err != nil {
		t.Fatal(err)
	}
	scoped, err := gorm.Open(postgres.Open(dsn+" search_path="+schema), config)
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() {
		sql, _ := scoped.DB()
		sql.Close()
		db.Exec("DROP SCHEMA " + schema + " CASCADE")
		root, _ := db.DB()
		root.Close()
	})
	if err = scoped.AutoMigrate(&model.Plugin{}, &model.PluginVersion{}); err != nil {
		t.Fatal(err)
	}
	return scoped
}

func pluginZip(t *testing.T, manifest service.PluginManifest, missingStyles bool) string {
	t.Helper()
	name := filepath.Join(t.TempDir(), "plugin.zip")
	file, err := os.Create(name)
	if err != nil {
		t.Fatal(err)
	}
	w := zip.NewWriter(file)
	raw, _ := json.Marshal(manifest)
	entries := map[string][]byte{"manifest.json": raw, manifest.Entry: []byte("export default function Page() { return null; }")}
	if !missingStyles {
		for _, style := range manifest.Styles {
			entries[style] = []byte(".test { color: red; }")
		}
	}
	for name, body := range entries {
		entry, err := w.Create(name)
		if err != nil {
			t.Fatal(err)
		}
		if _, err = entry.Write(body); err != nil {
			t.Fatal(err)
		}
	}
	if err = w.Close(); err != nil {
		t.Fatal(err)
	}
	if err = file.Close(); err != nil {
		t.Fatal(err)
	}
	return name
}

func TestPluginLifecycleIntegration(t *testing.T) {
	db := pluginTestDB(t)
	repo := repository.NewPluginRepository(db)
	svc := service.NewPluginService(repo, t.TempDir())
	if err := svc.EnsureBuiltins("../../builtin-plugins"); err != nil {
		t.Fatal(err)
	}
	p, original, err := svc.Active("travel")
	if err != nil || p.Type != "module" {
		t.Fatalf("builtin: %+v %v", p, err)
	}
	if err := svc.EnsureBuiltins("../../builtin-plugins"); err != nil {
		t.Fatal(err)
	}
	var count int64
	db.Model(&model.PluginVersion{}).Where("plugin_id = ?", p.ID).Count(&count)
	if count != 1 {
		t.Fatalf("duplicate builtin versions: %d", count)
	}

	m := service.PluginManifest{ID: "travel", Name: "Updated travel", Version: "test-2", Type: "module", APIVersion: 1, Entry: "entry.js", Styles: []string{"style.css"}}
	if _, err := svc.Upload(pluginZip(t, m, true), 9); err == nil {
		t.Fatal("missing CSS accepted")
	}
	archive := pluginZip(t, m, false)
	if _, err := svc.Upload(archive, 9); err != nil {
		t.Fatal(err)
	}
	if _, err := svc.Upload(archive, 9); err == nil {
		t.Fatal("existing version overwritten")
	}

	gin.SetMode(gin.TestMode)
	router := gin.New()
	h := NewPluginHandler(svc)
	router.GET("/plugin-assets/:slug/*path", h.Asset)
	router.GET("/api/v1/plugins/:slug/manifest", h.Manifest)
	check := func(url string, status int, contentType string) {
		t.Helper()
		recorder := httptest.NewRecorder()
		router.ServeHTTP(recorder, httptest.NewRequest("GET", url, nil))
		if recorder.Code != status {
			t.Fatalf("%s: %d, want %d: %s", url, recorder.Code, status, recorder.Body.String())
		}
		if contentType != "" && recorder.Header().Get("Content-Type") != contentType {
			t.Fatalf("wrong MIME: %s", recorder.Header().Get("Content-Type"))
		}
	}
	check("/plugin-assets/travel/test-2/entry.js", 404, "")
	if err := svc.Publish("travel", "test-2"); err != nil {
		t.Fatal(err)
	}
	check("/plugin-assets/travel/test-2/entry.js", 200, "text/javascript; charset=utf-8")
	check("/plugin-assets/travel/test-2/style.css", 200, "text/css; charset=utf-8")
	check("/plugin-assets/travel/"+original.Version+"/entry.js", 200, "text/javascript; charset=utf-8")
	check("/plugin-assets/travel/test-2/../../../secret", 404, "")
	if err := svc.EnsureBuiltins("../../builtin-plugins"); err != nil {
		t.Fatal(err)
	}
	p, _, _ = svc.Active("travel")
	if p.ActiveVersion != "test-2" || !p.ManagedByAdmin {
		t.Fatal("restart replaced administrator version")
	}
	if err := svc.Publish("travel", original.Version); err != nil {
		t.Fatal(err)
	}
	p, _, _ = svc.Active("travel")
	if !p.ManagedByAdmin || p.ActiveVersion != original.Version {
		t.Fatal("rollback not pinned")
	}
	if err := svc.Disable("travel"); err != nil {
		t.Fatal(err)
	}
	if err := svc.EnsureBuiltins("../../builtin-plugins"); err != nil {
		t.Fatal(err)
	}
	check("/api/v1/plugins/travel/manifest", 404, "")
	check("/plugin-assets/travel/"+original.Version+"/entry.js", 404, "")
	if err := svc.Disable("unknown"); err == nil {
		t.Fatal("unknown disable succeeded")
	}
}

func TestGeneratedPackagesCanBeUploaded(t *testing.T) {
	db := pluginTestDB(t)
	svc := service.NewPluginService(repository.NewPluginRepository(db), t.TempDir())
	for _, id := range []string{"index", "journal", "travel"} {
		root := filepath.Join("../../builtin-plugins", id)
		name := filepath.Join(t.TempDir(), id+".zip")
		file, err := os.Create(name)
		if err != nil {
			t.Fatal(err)
		}
		writer := zip.NewWriter(file)
		err = filepath.Walk(root, func(path string, info os.FileInfo, err error) error {
			if err != nil {
				return err
			}
			if info.IsDir() {
				return nil
			}
			rel, err := filepath.Rel(root, path)
			if err != nil {
				return err
			}
			out, err := writer.Create(filepath.ToSlash(rel))
			if err != nil {
				return err
			}
			in, err := os.Open(path)
			if err != nil {
				return err
			}
			defer in.Close()
			_, err = io.Copy(out, in)
			return err
		})
		if err != nil {
			t.Fatal(err)
		}
		if err = writer.Close(); err != nil {
			t.Fatal(err)
		}
		file.Close()
		version, err := svc.Upload(name, 1)
		if err != nil {
			t.Fatalf("%s: %v", id, err)
		}
		if err = svc.Publish(id, version.Version); err != nil {
			t.Fatal(err)
		}
	}
}

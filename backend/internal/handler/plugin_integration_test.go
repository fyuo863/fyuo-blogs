package handler

import (
	"archive/zip"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http/httptest"
	"os"
	"path/filepath"
	"reflect"
	"strings"
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
	svcRoot := t.TempDir()
	svc := service.NewPluginService(repo, svcRoot)
	seedPluginFixtures(t, db, svc)
	p, original, err := svc.Active("travel")
	if err != nil || p.Type != "module" {
		t.Fatalf("builtin: %+v %v", p, err)
	}
	svc = service.NewPluginService(repo, svcRoot)
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
	svc = service.NewPluginService(repo, svcRoot)
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
	svc = service.NewPluginService(repo, svcRoot)
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

func TestPluginAdminOrderIntegration(t *testing.T) {
	db := pluginTestDB(t)
	repo := repository.NewPluginRepository(db)
	svc := service.NewPluginService(repo, t.TempDir())
	seedPluginFixtures(t, db, svc)
	manifest := service.PluginManifest{ID: "order-test", Name: "Test", Version: "1.0.0", Type: "module", APIVersion: 1, Entry: "entry.js"}
	archive := pluginZip(t, manifest, false)
	if _, err := svc.Upload(archive, 1); err != nil {
		t.Fatal(err)
	}
	if _, err := svc.Upload(archive, 1); !errors.Is(err, service.ErrPluginVersionExists) {
		t.Fatalf("duplicate: %v", err)
	}
	gin.SetMode(gin.TestMode)
	router := gin.New()
	handler := NewPluginHandler(svc)
	router.GET("/admin/plugins", handler.AdminList)
	router.PUT("/admin/plugins/order", handler.SetOrder)
	read := httptest.NewRecorder()
	router.ServeHTTP(read, httptest.NewRequest("GET", "/admin/plugins", nil))
	var response struct {
		Data []model.Plugin `json:"data"`
	}
	if read.Code != 200 || json.Unmarshal(read.Body.Bytes(), &response) != nil || len(response.Data) != 4 {
		t.Fatalf("list: %s", read.Body.String())
	}
	for _, p := range response.Data {
		if len(p.Versions) != 1 {
			t.Fatalf("missing versions: %+v", p)
		}
	}
	order := []string{"order-test", "travel", "index", "journal"}
	save := func(body string, status int) {
		t.Helper()
		recorder := httptest.NewRecorder()
		request := httptest.NewRequest("PUT", "/admin/plugins/order", strings.NewReader(body))
		request.Header.Set("Content-Type", "application/json")
		router.ServeHTTP(recorder, request)
		if recorder.Code != status {
			t.Fatalf("save status %d: %s", recorder.Code, recorder.Body.String())
		}
	}
	save(`{"slugs":["order-test","travel","index","journal"]}`, 200)
	save(`{"slugs":["index","travel","index","journal"]}`, 409)
	save(`{"slugs":["travel","index","journal"]}`, 409)
	save(`{"slugs":["missing","travel","index","journal"]}`, 409)
	save(`{}`, 400)
	items, err := repository.NewPluginRepository(db).ListAll()
	if err != nil {
		t.Fatal(err)
	}
	got := []string{}
	for _, p := range items {
		got = append(got, p.Slug)
	}
	if !reflect.DeepEqual(got, order) {
		t.Fatalf("order not persisted or rollback failed: %v", got)
	}
	if err := svc.Publish("order-test", "1.0.0"); err != nil {
		t.Fatal(err)
	}
	items, err = svc.List()
	if err != nil || len(items) != 4 || items[0].Slug != "order-test" || items[1].Slug != "travel" {
		t.Fatalf("public order: %+v %v", items, err)
	}
	if err := svc.Disable("travel"); err != nil {
		t.Fatal(err)
	}
	items, _ = svc.List()
	if len(items) != 3 || items[1].Slug != "index" {
		t.Fatalf("disabled filter: %+v", items)
	}
	_, travel, _ := svc.Active("index")
	if err := svc.Publish("index", travel.Version); err != nil {
		t.Fatal(err)
	}
	items, _ = svc.List()
	if items[0].Slug != "order-test" || items[1].Slug != "index" {
		t.Fatal("publish changed order")
	}
}

// Historical packages are test fixtures only. Production startup never imports them.
func seedPluginFixtures(t *testing.T, db *gorm.DB, svc *service.PluginService) {
	t.Helper()
	var count int64
	db.Model(&model.Plugin{}).Count(&count)
	if count != 0 {
		return
	}
	for _, id := range []string{"index", "journal", "travel"} {
		raw, err := os.ReadFile(filepath.Join("../../builtin-plugins", id, "manifest.json"))
		if err != nil {
			t.Fatal(err)
		}
		var manifest service.PluginManifest
		if err := json.Unmarshal(raw, &manifest); err != nil {
			t.Fatal(err)
		}
		if _, err := svc.Upload(pluginZip(t, manifest, false), 1); err != nil {
			t.Fatal(err)
		}
		if err := svc.Publish(id, manifest.Version); err != nil {
			t.Fatal(err)
		}
	}
}

func TestPluginServiceRestartPreservesData(t *testing.T) {
	db := pluginTestDB(t)
	root := t.TempDir()
	svc := service.NewPluginService(repository.NewPluginRepository(db), root)
	items, err := svc.ListAll()
	if err != nil || len(items) != 0 {
		t.Fatalf("new host must be empty: %+v %v", items, err)
	}
	m := service.PluginManifest{ID: "custom-only", Name: "Custom", Version: "1.0.0", Type: "module", APIVersion: 1, Entry: "entry.js"}
	if _, err := svc.Upload(pluginZip(t, m, false), 1); err != nil {
		t.Fatal(err)
	}
	if err := svc.Publish(m.ID, m.Version); err != nil {
		t.Fatal(err)
	}
	if err := svc.SetOrder([]string{m.ID}); err != nil {
		t.Fatal(err)
	}
	m.Version = "2.0.0"
	if _, err := svc.Upload(pluginZip(t, m, false), 1); err != nil {
		t.Fatal(err)
	}
	before, _ := svc.ListAll()
	beforeBytes, _ := os.ReadFile(filepath.Join(root, m.ID, "1.0.0", "entry.js"))
	restarted := service.NewPluginService(repository.NewPluginRepository(db), root)
	after, err := restarted.ListAll()
	afterBytes, readErr := os.ReadFile(filepath.Join(root, m.ID, "1.0.0", "entry.js"))
	if err != nil || readErr != nil || !reflect.DeepEqual(before, after) || !reflect.DeepEqual(beforeBytes, afterBytes) {
		t.Fatal("restart changed plugin data")
	}
	if err := restarted.Disable(m.ID); err != nil {
		t.Fatal(err)
	}
	restarted = service.NewPluginService(repository.NewPluginRepository(db), root)
	public, err := restarted.List()
	if err != nil || len(public) != 0 {
		t.Fatal("restart enabled disabled plugin")
	}
}

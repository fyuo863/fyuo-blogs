package config

import (
	"os"
	"path/filepath"
	"testing"
	"time"
)

func TestLoadDatabasePool(t *testing.T) {
	p := filepath.Join(t.TempDir(), "config.yaml")
	if err := os.WriteFile(p, []byte("database:\n  max_idle_conns: 7\n  max_open_conns: 23\n  conn_max_lifetime: 91\n  query_timeout: 2s\n"), 0600); err != nil {
		t.Fatal(err)
	}
	c, err := Load(p)
	if err != nil {
		t.Fatal(err)
	}
	if c.Database.MaxIdleConns != 7 || c.Database.MaxOpenConns != 23 || c.Database.ConnMaxLifetime != 91 || c.Database.QueryTimeout != 2*time.Second {
		t.Fatalf("pool decoded incorrectly: idle=%d open=%d lifetime=%d", c.Database.MaxIdleConns, c.Database.MaxOpenConns, c.Database.ConnMaxLifetime)
	}
}

func TestReleaseRejectsUnsafeSecrets(t *testing.T) {
	for _, secret := range []string{"", "short", "db-password-with-at-least-32-characters", "dev-only-change-me-xxxxxxxxxxxxxxxx"} {
		t.Run(secret, func(t *testing.T) {
			t.Setenv("GIN_MODE", "release")
			t.Setenv("AUTH_TOKEN_SECRET", secret)
			t.Setenv("DB_PASSWORD", "db-password-with-at-least-32-characters")
			p := filepath.Join(t.TempDir(), "config.yaml")
			os.WriteFile(p, []byte("server:\n  mode: release\n"), 0600)
			if _, err := Load(p); err == nil {
				t.Fatal("accepted unsafe key")
			}
		})
	}
}

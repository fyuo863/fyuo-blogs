package service

import "testing"

func TestValidatePluginManifest(t *testing.T) {
	valid := PluginManifest{ID: "journal", Name: "Journal", Version: "2026.09.1", Type: "iframe", Entry: "index.html"}
	if err := ValidatePluginManifest(valid); err != nil {
		t.Fatalf("valid manifest rejected: %v", err)
	}
	for _, entry := range []string{"../index.html", "/tmp/index.html", ""} {
		invalid := valid
		invalid.Entry = entry
		if err := ValidatePluginManifest(invalid); err == nil {
			t.Fatalf("entry %q accepted", entry)
		}
	}
}

func TestValidatePluginManifestRejectsUnsafeParts(t *testing.T) {
	for _, id := range []string{"../journal", "Journal", ""} {
		m := PluginManifest{ID: id, Name: "Journal", Version: "1.0.0", Type: "iframe", Entry: "index.html"}
		if ValidatePluginManifest(m) == nil {
			t.Fatalf("id %q accepted", id)
		}
	}
}

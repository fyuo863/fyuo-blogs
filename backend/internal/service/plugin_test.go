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

func TestModuleManifestContract(t *testing.T) {
	valid := PluginManifest{ID: "index", Name: "Index", Version: "3.0.0-a1", Type: "module", APIVersion: 1, Entry: "entry.js", Styles: []string{"style.css"}}
	if err := ValidatePluginManifest(valid); err != nil {
		t.Fatal(err)
	}
	for _, mutate := range []func(*PluginManifest){
		func(m *PluginManifest) { m.APIVersion = 2 },
		func(m *PluginManifest) { m.Type = "script" },
		func(m *PluginManifest) { m.Entry = "index.html" },
		func(m *PluginManifest) { m.Entry = "C:\\entry.js" },
		func(m *PluginManifest) { m.Entry = "https://example.com/entry.js" },
		func(m *PluginManifest) { m.Styles = []string{"../style.css"} },
		func(m *PluginManifest) { m.Styles = []string{"style.css?x"} },
	} {
		m := valid
		mutate(&m)
		if ValidatePluginManifest(m) == nil {
			t.Fatalf("invalid module accepted: %+v", m)
		}
	}
}

package service

import (
	"context"
	"encoding/base64"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestDefaultHomeContentIsValid(t *testing.T) {
	content, err := normalizeHomeContent(DefaultHomeContent())
	if err != nil {
		t.Fatalf("default home content should be valid: %v", err)
	}
	if len(content.Projects) != 6 {
		t.Fatalf("expected 6 default projects, got %d", len(content.Projects))
	}
}

func TestNormalizeHomeContentRejectsIncompleteProject(t *testing.T) {
	content := DefaultHomeContent()
	content.Projects[0].Title = ""
	if _, err := normalizeHomeContent(content); err != ErrInvalidHomeContent {
		t.Fatalf("expected ErrInvalidHomeContent, got %v", err)
	}
}

func TestGitHubRepositoryResolverUsesFirstNonBadgeReadmeImage(t *testing.T) {
	var server *httptest.Server
	server = httptest.NewServer(http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		if request.URL.Path != "/repos/fyuo863/demo/readme" {
			t.Fatalf("unexpected path: %s", request.URL.Path)
		}
		readme := "![build](https://img.shields.io/github/actions/workflow/status/fyuo863/demo/check.yml)\n![demo](assets/cover.svg)"
		writer.Header().Set("Content-Type", "application/json")
		_, _ = fmt.Fprintf(writer, `{"content":%q,"encoding":"base64","download_url":%q}`,
			base64.StdEncoding.EncodeToString([]byte(readme)), server.URL+"/fyuo863/demo/main/README.md")
	}))
	defer server.Close()

	resolver := newGitHubRepositoryResolver(server.Client(), server.URL)
	project, err := resolver.Resolve(context.Background(), "https://github.com/fyuo863/demo")
	if err != nil {
		t.Fatalf("resolve repository: %v", err)
	}
	if project.Title != "demo" {
		t.Fatalf("expected repository title demo, got %q", project.Title)
	}
	if project.Image != server.URL+"/fyuo863/demo/main/assets/cover.svg" {
		t.Fatalf("unexpected README image URL: %q", project.Image)
	}
}

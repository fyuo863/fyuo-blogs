package service

import (
	"context"
	"encoding/base64"
	"errors"
	"fmt"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

type repositoryResolverFunc func(context.Context, string) (HomeProject, error)

func (resolver repositoryResolverFunc) Resolve(ctx context.Context, repositoryURL string) (HomeProject, error) {
	return resolver(ctx, repositoryURL)
}

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

func TestResolveHomeContentKeepsExistingImageWhenReadmeHasNoDisplayImage(t *testing.T) {
	current := DefaultHomeContent()
	input := HomeContentInput{
		CoverGitHubURL:   current.CoverGitHubURL,
		CoverDescription: "更新后的封面简介.",
		Projects: []HomeProjectInput{
			{LinkURL: current.Projects[0].LinkURL, Description: "更新后的项目简介."},
		},
	}
	resolver := repositoryResolverFunc(func(_ context.Context, repositoryURL string) (HomeProject, error) {
		if repositoryURL == current.Projects[0].LinkURL {
			return HomeProject{}, fmt.Errorf("%w: README 中未找到展示图", ErrRepositoryMetadata)
		}
		return HomeProject{Image: "https://example.test/cover.png", Title: "fyuobot-ts", LinkURL: repositoryURL}, nil
	})

	content, err := newHomeContentService(nil, resolver).resolveHomeContent(context.Background(), input, current)
	if err != nil {
		t.Fatalf("resolve home content: %v", err)
	}
	if content.Projects[0].Image != current.Projects[0].Image {
		t.Fatalf("expected cached image %q, got %q", current.Projects[0].Image, content.Projects[0].Image)
	}
	if content.Projects[0].Description != input.Projects[0].Description {
		t.Fatalf("expected updated description %q, got %q", input.Projects[0].Description, content.Projects[0].Description)
	}
}

func TestResolveHomeContentReportsNewRepositoryWithoutDisplayImage(t *testing.T) {
	current := DefaultHomeContent()
	input := HomeContentInput{
		CoverGitHubURL:   current.CoverGitHubURL,
		CoverDescription: current.CoverDescription,
		Projects:         []HomeProjectInput{{LinkURL: "https://github.com/fyuo863/new-project", Description: "新项目."}},
	}
	resolver := repositoryResolverFunc(func(_ context.Context, repositoryURL string) (HomeProject, error) {
		if repositoryURL == input.Projects[0].LinkURL {
			return HomeProject{}, fmt.Errorf("%w: README 中未找到展示图", ErrRepositoryMetadata)
		}
		return HomeProject{Image: "https://example.test/cover.png", Title: "fyuobot-ts", LinkURL: repositoryURL}, nil
	})

	_, err := newHomeContentService(nil, resolver).resolveHomeContent(context.Background(), input, current)
	if !errors.Is(err, ErrRepositoryMetadata) {
		t.Fatalf("expected ErrRepositoryMetadata, got %v", err)
	}
	if err == nil || !strings.Contains(err.Error(), input.Projects[0].LinkURL) {
		t.Fatalf("expected repository URL in error, got %v", err)
	}
}

package service

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"net/url"
	"path"
	"regexp"
	"strings"
	"time"
)

var (
	ErrRepositoryMetadata = errors.New("repository metadata unavailable")
	markdownImagePattern  = regexp.MustCompile(`!\[[^\]]*\]\(([^\s)]+)(?:\s+"[^"]*")?\)`)
	htmlImagePattern      = regexp.MustCompile(`(?i)<img[^>]+src=["']([^"']+)["']`)
)

type RepositoryMetadataResolver interface {
	Resolve(ctx context.Context, repositoryURL string) (HomeProject, error)
}

type GitHubRepositoryResolver struct {
	client  *http.Client
	apiBase string
}

func NewGitHubRepositoryResolver(client *http.Client) *GitHubRepositoryResolver {
	if client == nil {
		client = &http.Client{Timeout: 5 * time.Second}
	}
	return newGitHubRepositoryResolver(client, "https://api.github.com")
}

func newGitHubRepositoryResolver(client *http.Client, apiBase string) *GitHubRepositoryResolver {
	return &GitHubRepositoryResolver{client: client, apiBase: strings.TrimRight(apiBase, "/")}
}

func (r *GitHubRepositoryResolver) Resolve(ctx context.Context, repositoryURL string) (HomeProject, error) {
	owner, repository, err := githubRepositoryCoordinates(repositoryURL)
	if err != nil {
		return HomeProject{}, err
	}

	request, err := http.NewRequestWithContext(ctx, http.MethodGet, fmt.Sprintf("%s/repos/%s/%s/readme", r.apiBase, url.PathEscape(owner), url.PathEscape(repository)), nil)
	if err != nil {
		return HomeProject{}, fmt.Errorf("%w: 无法创建 README 请求", ErrRepositoryMetadata)
	}
	request.Header.Set("Accept", "application/vnd.github+json")
	request.Header.Set("User-Agent", "fyuo-blogs-home-editor")
	request.Header.Set("X-GitHub-Api-Version", "2022-11-28")

	response, err := r.client.Do(request)
	if err != nil {
		return HomeProject{}, fmt.Errorf("%w: 无法读取 GitHub README", ErrRepositoryMetadata)
	}
	defer response.Body.Close()
	if response.StatusCode != http.StatusOK {
		return HomeProject{}, fmt.Errorf("%w: GitHub README 返回 %d", ErrRepositoryMetadata, response.StatusCode)
	}

	var readme struct {
		Content     string `json:"content"`
		Encoding    string `json:"encoding"`
		DownloadURL string `json:"download_url"`
	}
	if err := json.NewDecoder(response.Body).Decode(&readme); err != nil {
		return HomeProject{}, fmt.Errorf("%w: 无法解析 GitHub README", ErrRepositoryMetadata)
	}
	if readme.Encoding != "base64" || readme.DownloadURL == "" {
		return HomeProject{}, fmt.Errorf("%w: GitHub README 缺少可读取内容", ErrRepositoryMetadata)
	}
	decoded, err := base64.StdEncoding.DecodeString(strings.ReplaceAll(readme.Content, "\n", ""))
	if err != nil {
		return HomeProject{}, fmt.Errorf("%w: README 内容解码失败", ErrRepositoryMetadata)
	}
	imageURL := firstReadmeImageURL(string(decoded), readme.DownloadURL)
	if imageURL == "" {
		return HomeProject{}, fmt.Errorf("%w: README 中未找到展示图", ErrRepositoryMetadata)
	}

	return HomeProject{Image: imageURL, Title: repository, LinkURL: repositoryURL}, nil
}

func githubRepositoryCoordinates(repositoryURL string) (string, string, error) {
	parsed, err := url.Parse(strings.TrimSpace(repositoryURL))
	if err != nil || (parsed.Scheme != "https" && parsed.Scheme != "http") || !strings.EqualFold(parsed.Hostname(), "github.com") {
		return "", "", fmt.Errorf("%w: 请输入 GitHub 仓库链接", ErrRepositoryMetadata)
	}
	parts := strings.Split(strings.Trim(parsed.Path, "/"), "/")
	if len(parts) != 2 || parts[0] == "" || parts[1] == "" {
		return "", "", fmt.Errorf("%w: GitHub 链接必须指向仓库根目录", ErrRepositoryMetadata)
	}
	repository := strings.TrimSuffix(parts[1], ".git")
	if repository == "" {
		return "", "", fmt.Errorf("%w: GitHub 仓库名称无效", ErrRepositoryMetadata)
	}
	return parts[0], repository, nil
}

func firstReadmeImageURL(readme, downloadURL string) string {
	candidates := append(markdownImagePattern.FindAllStringSubmatch(readme, -1), htmlImagePattern.FindAllStringSubmatch(readme, -1)...)
	for _, candidate := range candidates {
		if len(candidate) < 2 {
			continue
		}
		imageURL := resolveReadmeAssetURL(candidate[1], downloadURL)
		if imageURL != "" && !isReadmeBadge(imageURL) {
			return imageURL
		}
	}
	return ""
}

func resolveReadmeAssetURL(candidate, downloadURL string) string {
	candidate = strings.Trim(strings.TrimSpace(candidate), "<>")
	if candidate == "" || strings.HasPrefix(candidate, "data:") {
		return ""
	}
	assetURL, err := url.Parse(candidate)
	if err != nil {
		return ""
	}
	if assetURL.IsAbs() {
		return assetURL.String()
	}
	readmeURL, err := url.Parse(downloadURL)
	if err != nil {
		return ""
	}
	if strings.HasPrefix(candidate, "/") {
		readmeURL.Path = path.Join(path.Dir(readmeURL.Path), candidate)
		readmeURL.RawQuery = ""
		return readmeURL.String()
	}
	return readmeURL.ResolveReference(assetURL).String()
}

func isReadmeBadge(imageURL string) bool {
	lower := strings.ToLower(imageURL)
	return strings.Contains(lower, "shields.io") || strings.Contains(lower, "badge")
}

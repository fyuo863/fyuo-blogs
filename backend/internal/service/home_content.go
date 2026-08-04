package service

import (
	"context"
	"encoding/json"
	"errors"
	"myblog/internal/model"
	"myblog/internal/repository"
	"strings"
	"sync"

	"gorm.io/gorm"
)

var ErrInvalidHomeContent = errors.New("invalid home content")

type HomeProject struct {
	Image       string `json:"image"`
	Title       string `json:"title"`
	LinkURL     string `json:"link_url"`
	Description string `json:"description"`
}

type HomeContent struct {
	CoverImage       string        `json:"cover_image"`
	CoverTitle       string        `json:"cover_title"`
	CoverGitHubURL   string        `json:"cover_github_url"`
	CoverDescription string        `json:"cover_description"`
	Projects         []HomeProject `json:"projects"`
}

type HomeProjectInput struct {
	LinkURL     string `json:"link_url"`
	Description string `json:"description"`
}

type HomeContentInput struct {
	CoverGitHubURL   string             `json:"cover_github_url"`
	CoverDescription string             `json:"cover_description"`
	Projects         []HomeProjectInput `json:"projects"`
}

type HomeContentService struct {
	content  *repository.HomeContentRepository
	resolver RepositoryMetadataResolver
}

func NewHomeContentService(content *repository.HomeContentRepository) *HomeContentService {
	return newHomeContentService(content, NewGitHubRepositoryResolver(nil))
}

func newHomeContentService(content *repository.HomeContentRepository, resolver RepositoryMetadataResolver) *HomeContentService {
	return &HomeContentService{content: content, resolver: resolver}
}

func DefaultHomeContent() HomeContent {
	return HomeContent{
		CoverImage:       "/fyuobot-ts.svg",
		CoverTitle:       "fyuobot-ts",
		CoverGitHubURL:   "https://github.com/fyuo863/fyuobot-ts",
		CoverDescription: "事件驱动的轻量化 Agent 框架.",
		Projects: []HomeProject{
			{Image: "/fyuo-blogs.svg", Title: "fyuo-blogs.", LinkURL: "https://github.com/fyuo863/fyuo-blogs", Description: "个人博客项目(即本网站)."},
			{Image: "/go-file-fetch.svg", Title: "go-file-fetch", LinkURL: "https://github.com/fyuo863/go-file-fetch", Description: "简单的多线程文件下载器."},
			{Image: "/fyuo-bot.svg", Title: "fyuo-bot", LinkURL: "https://github.com/fyuo863/fyuo_bot", Description: "一个轻量化的 Agent 框架."},
			{Image: "/fyuo-ops.svg", Title: "fyuo-ops", LinkURL: "https://github.com/fyuo863/fyuo-ops", Description: "运维特化 Agent."},
			{Image: "/fyuobot-ts.svg", Title: "fyuobot-ts", LinkURL: "https://github.com/fyuo863/fyuobot-ts", Description: "TypeScript 版本的模块化 Agent 框架."},
			{Image: "/fyuobot-ts-tools.svg", Title: "fyuobot-ts-tools", LinkURL: "https://github.com/fyuo863/fyuobot-ts-tools", Description: "fyuobot-ts 使用的工具集."},
		},
	}
}

func (s *HomeContentService) Get() (HomeContent, error) {
	stored, err := s.content.Get()
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return DefaultHomeContent(), nil
	}
	if err != nil {
		return HomeContent{}, err
	}
	return fromModel(stored)
}

func (s *HomeContentService) Update(ctx context.Context, input HomeContentInput) (HomeContent, error) {
	normalized, err := normalizeHomeContentInput(input)
	if err != nil {
		return HomeContent{}, err
	}
	resolved, err := s.resolveHomeContent(ctx, normalized)
	if err != nil {
		return HomeContent{}, err
	}

	projects, err := json.Marshal(resolved.Projects)
	if err != nil {
		return HomeContent{}, err
	}
	if err := s.content.Save(&model.HomeContent{
		CoverImage:       resolved.CoverImage,
		CoverTitle:       resolved.CoverTitle,
		CoverGitHubURL:   resolved.CoverGitHubURL,
		CoverDescription: resolved.CoverDescription,
		ProjectsJSON:     string(projects),
	}); err != nil {
		return HomeContent{}, err
	}
	return resolved, nil
}

func (s *HomeContentService) resolveHomeContent(ctx context.Context, input HomeContentInput) (HomeContent, error) {
	urls := make([]string, 0, len(input.Projects)+1)
	urls = append(urls, input.CoverGitHubURL)
	for _, project := range input.Projects {
		urls = append(urls, project.LinkURL)
	}
	resolved := make([]HomeProject, len(urls))
	var firstErr error
	var lock sync.Mutex
	var group sync.WaitGroup
	for index, repositoryURL := range urls {
		group.Add(1)
		go func(index int, repositoryURL string) {
			defer group.Done()
			project, err := s.resolver.Resolve(ctx, repositoryURL)
			if err != nil {
				lock.Lock()
				if firstErr == nil {
					firstErr = err
				}
				lock.Unlock()
				return
			}
			resolved[index] = project
		}(index, repositoryURL)
	}
	group.Wait()
	if firstErr != nil {
		return HomeContent{}, firstErr
	}

	for index := range input.Projects {
		resolved[index+1].Description = input.Projects[index].Description
	}
	return HomeContent{
		CoverImage:       resolved[0].Image,
		CoverTitle:       resolved[0].Title,
		CoverGitHubURL:   resolved[0].LinkURL,
		CoverDescription: input.CoverDescription,
		Projects:         resolved[1:],
	}, nil
}

func fromModel(stored model.HomeContent) (HomeContent, error) {
	var projects []HomeProject
	if err := json.Unmarshal([]byte(stored.ProjectsJSON), &projects); err != nil {
		return HomeContent{}, err
	}
	return normalizeHomeContent(HomeContent{
		CoverImage:       stored.CoverImage,
		CoverTitle:       stored.CoverTitle,
		CoverGitHubURL:   stored.CoverGitHubURL,
		CoverDescription: stored.CoverDescription,
		Projects:         projects,
	})
}

func normalizeHomeContent(input HomeContent) (HomeContent, error) {
	input.CoverImage = strings.TrimSpace(input.CoverImage)
	input.CoverTitle = strings.TrimSpace(input.CoverTitle)
	input.CoverGitHubURL = strings.TrimSpace(input.CoverGitHubURL)
	input.CoverDescription = strings.TrimSpace(input.CoverDescription)
	if input.CoverImage == "" || input.CoverTitle == "" || input.CoverDescription == "" || len(input.Projects) == 0 || len(input.Projects) > 24 {
		return HomeContent{}, ErrInvalidHomeContent
	}
	for index := range input.Projects {
		project := &input.Projects[index]
		project.Image = strings.TrimSpace(project.Image)
		project.Title = strings.TrimSpace(project.Title)
		project.LinkURL = strings.TrimSpace(project.LinkURL)
		project.Description = strings.TrimSpace(project.Description)
		if project.Image == "" || project.Title == "" || project.Description == "" {
			return HomeContent{}, ErrInvalidHomeContent
		}
	}
	return input, nil
}

func normalizeHomeContentInput(input HomeContentInput) (HomeContentInput, error) {
	input.CoverGitHubURL = strings.TrimSpace(input.CoverGitHubURL)
	input.CoverDescription = strings.TrimSpace(input.CoverDescription)
	if input.CoverGitHubURL == "" || input.CoverDescription == "" || len(input.Projects) == 0 || len(input.Projects) > 24 {
		return HomeContentInput{}, ErrInvalidHomeContent
	}
	for index := range input.Projects {
		project := &input.Projects[index]
		project.LinkURL = strings.TrimSpace(project.LinkURL)
		project.Description = strings.TrimSpace(project.Description)
		if project.LinkURL == "" || project.Description == "" {
			return HomeContentInput{}, ErrInvalidHomeContent
		}
	}
	return input, nil
}

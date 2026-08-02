package service

import "testing"

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

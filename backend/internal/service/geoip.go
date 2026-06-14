package service

import (
	"context"
	"encoding/json"
	"net"
	"net/http"
	"net/url"
	"os"
	"strings"
	"time"
)

type geoIPResponse struct {
	Success bool   `json:"success"`
	City    string `json:"city"`
}

func lookupCity(ctx context.Context, ip string) string {
	ip = strings.TrimSpace(ip)
	if ip == "" {
		return "unknown"
	}

	parsed := net.ParseIP(ip)
	if parsed == nil {
		return "unknown"
	}
	if parsed.IsLoopback() || parsed.IsPrivate() {
		return "local network"
	}

	baseURL := os.Getenv("IP_GEOLOOKUP_URL")
	if strings.TrimSpace(baseURL) == "" {
		baseURL = "https://ipwho.is"
	}

	reqURL := strings.TrimRight(baseURL, "/") + "/" + url.PathEscape(ip)
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, reqURL, nil)
	if err != nil {
		return "unknown"
	}

	client := &http.Client{Timeout: 2 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return "unknown"
	}
	defer resp.Body.Close()

	var payload geoIPResponse
	if err := json.NewDecoder(resp.Body).Decode(&payload); err != nil {
		return "unknown"
	}
	if !payload.Success || strings.TrimSpace(payload.City) == "" {
		return "unknown"
	}
	return payload.City
}

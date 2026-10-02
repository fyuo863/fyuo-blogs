package security

import (
	"crypto/sha256"
	"sync"
	"time"
)

type bucket struct {
	count int
	until time.Time
}
type Limiter struct {
	mu      sync.Mutex
	entries map[[32]byte]bucket
	max     int
	window  time.Duration
}

func NewLimiter(max int, window time.Duration) *Limiter {
	return &Limiter{entries: make(map[[32]byte]bucket), max: max, window: window}
}
func (l *Limiter) Allow(key string) bool {
	l.mu.Lock()
	defer l.mu.Unlock()
	now := time.Now()
	hash := sha256.Sum256([]byte(key))
	b := l.entries[hash]
	if !now.Before(b.until) {
		if len(l.entries) >= 10000 {
			for k, v := range l.entries {
				if !now.Before(v.until) {
					delete(l.entries, k)
				}
			}
		}
		if len(l.entries) >= 10000 {
			return false
		}
		b = bucket{until: now.Add(l.window)}
	}
	if b.count >= l.max {
		return false
	}
	b.count++
	l.entries[hash] = b
	return true
}

package security

import (
	"testing"
	"time"
)

func TestLimiter(t *testing.T) {
	l := NewLimiter(2, time.Millisecond*10)
	if !l.Allow("a") || !l.Allow("a") || l.Allow("a") || !l.Allow("b") {
		t.Fatal("limit/isolation")
	}
	time.Sleep(time.Millisecond * 15)
	if !l.Allow("a") {
		t.Fatal("expiry")
	}
}

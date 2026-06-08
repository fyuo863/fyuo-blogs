package service

import (
	"context"
	"testing"

	"myblog/internal/database"

	"github.com/alicebob/miniredis/v2"
	"github.com/redis/go-redis/v9"
)

func setupCounterRedis(t *testing.T) *miniredis.Miniredis {
	t.Helper()

	mr, err := miniredis.Run()
	if err != nil {
		t.Fatalf("failed to start miniredis: %v", err)
	}

	database.RDB = redis.NewClient(&redis.Options{Addr: mr.Addr()})
	t.Cleanup(func() {
		_ = database.RDB.Close()
		database.RDB = nil
		mr.Close()
	})
	return mr
}

func TestHashIPStableAndTruncated(t *testing.T) {
	got := HashIP("127.0.0.1")
	if len(got) != 16 {
		t.Fatalf("HashIP length = %d, want 16", len(got))
	}
	if got != HashIP("127.0.0.1") {
		t.Fatal("HashIP should be stable for the same input")
	}
	if got == HashIP("127.0.0.2") {
		t.Fatal("HashIP should differ for different inputs")
	}
}

func TestIncrementCounterStartsFromDBBase(t *testing.T) {
	setupCounterRedis(t)

	ctx := context.Background()
	key := "article:views:7"

	got, err := incrementCounter(ctx, key, 41)
	if err != nil {
		t.Fatalf("incrementCounter() error = %v", err)
	}
	if got != 42 {
		t.Fatalf("first increment = %d, want 42", got)
	}

	got, err = incrementCounter(ctx, key, 41)
	if err != nil {
		t.Fatalf("incrementCounter() second error = %v", err)
	}
	if got != 43 {
		t.Fatalf("second increment = %d, want 43", got)
	}
}

func TestToggleLikeCounterIsAtomicToggle(t *testing.T) {
	setupCounterRedis(t)

	ctx := context.Background()
	first, err := toggleLikeCounter(ctx, 7, "member-a", 3)
	if err != nil {
		t.Fatalf("toggleLikeCounter() first error = %v", err)
	}
	if !first.Liked || first.LikeCount != 4 {
		t.Fatalf("first toggle = %+v, want liked=true count=4", first)
	}

	second, err := toggleLikeCounter(ctx, 7, "member-a", 3)
	if err != nil {
		t.Fatalf("toggleLikeCounter() second error = %v", err)
	}
	if second.Liked || second.LikeCount != 3 {
		t.Fatalf("second toggle = %+v, want liked=false count=3", second)
	}

	third, err := toggleLikeCounter(ctx, 7, "member-b", 3)
	if err != nil {
		t.Fatalf("toggleLikeCounter() third error = %v", err)
	}
	if !third.Liked || third.LikeCount != 4 {
		t.Fatalf("third toggle = %+v, want liked=true count=4", third)
	}
}

func TestAddCounterIDsIgnoresMalformedKeys(t *testing.T) {
	ids := map[uint]struct{}{}
	addCounterIDs(ids, []string{
		"article:views:1",
		"article:likes:2",
		"article:views:not-a-number",
		"article:views:3:extra",
		"unrelated",
	})

	if _, ok := ids[1]; !ok {
		t.Fatal("expected id 1")
	}
	if _, ok := ids[2]; !ok {
		t.Fatal("expected id 2")
	}
	if len(ids) != 2 {
		t.Fatalf("ids length = %d, want 2", len(ids))
	}
}

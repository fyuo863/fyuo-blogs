package service

import (
	"context"
	"fmt"
	"github.com/alicebob/miniredis/v2/server"
	"github.com/redis/go-redis/v9"
	"gorm.io/gorm"
	"myblog/internal/database"
	"strings"
	"sync"
	"sync/atomic"
	"testing"
	"time"
)

func TestCacheMergeNegativeAndGeneration(t *testing.T) {
	mr := setupCounterRedis(t)
	var boot atomic.Value
	boot.Store("test-server")
	mr.Server().SetPreHook(func(peer *server.Peer, cmd string, args ...string) bool {
		if strings.EqualFold(cmd, "INFO") {
			peer.WriteBulk("run_id:" + boot.Load().(string) + "\r\n")
			return true
		}
		return false
	})
	ctx := context.Background()
	var loads atomic.Int32
	var wg sync.WaitGroup
	for i := 0; i < 40; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			_, err := cachedRead(ctx, "merge", func(context.Context) (any, error) { loads.Add(1); time.Sleep(20 * time.Millisecond); return "old", nil })
			if err != nil {
				t.Error(err)
			}
		}()
	}
	wg.Wait()
	if loads.Load() != 1 {
		t.Fatalf("origin loads=%d", loads.Load())
	}
	for i := 0; i < 2; i++ {
		b, e := cachedRead(ctx, "missing", func(context.Context) (any, error) { loads.Add(1); return nil, gorm.ErrRecordNotFound })
		if e != nil || string(b) != "null" {
			t.Fatalf("negative cache %s %v", b, e)
		}
	}
	if loads.Load() != 2 {
		t.Fatal("negative response was not cached")
	}
	started, release := make(chan struct{}), make(chan struct{})
	wg.Add(1)
	go func() {
		defer wg.Done()
		_, _ = cachedRead(ctx, "race", func(context.Context) (any, error) { close(started); <-release; return "old", nil })
	}()
	<-started
	finish, err := beginArticleWrite(ctx)
	if err != nil {
		t.Fatal(err)
	}
	finish()
	close(release)
	wg.Wait()
	b, err := cachedRead(ctx, "race", func(context.Context) (any, error) { return "new", nil })
	if err != nil || string(b) != `"new"` {
		t.Fatalf("stale refill exposed: %s %v", b, err)
	}
	mr.FastForward(6 * time.Second)
	b, err = cachedRead(ctx, "missing", func(context.Context) (any, error) { return "created", nil })
	if err != nil || string(b) != `"created"` {
		t.Fatalf("negative cache failed to expire: %s %v", b, err)
	}
	boot.Store("restarted-server")
	b, err = cachedRead(ctx, "merge", func(context.Context) (any, error) { return "after restart", nil })
	if err != nil || string(b) != `"after restart"` {
		t.Fatalf("restart exposed restored stale content: %s %v", b, err)
	}
}

func TestOriginBackpressure(t *testing.T) {
	setupCounterRedis(t)
	ctx := context.Background()
	for i := 0; i < cap(originSlots); i++ {
		originSlots <- struct{}{}
	}
	defer func() {
		for i := 0; i < cap(originSlots); i++ {
			<-originSlots
		}
	}()
	_, err := cachedRead(ctx, "full", func(context.Context) (any, error) { t.Fatal("unbounded SQL fallback"); return nil, nil })
	if err != ErrReadBusy {
		t.Fatalf("want busy, got %v", err)
	}
}

func TestAdmissionLuaAtomicity(t *testing.T) {
	setupCounterRedis(t)
	ctx := context.Background()
	keys := []string{visitStream, "dedup", "counter", "rate", "iprate", visitMaintenance}
	accept := func(id string) ([]int64, error) {
		keys[1] = "dedup:" + id
		return database.RDB.Eval(ctx, acceptVisitScript, keys, 1, 10, `{"event_id":"test"}`, id, 60, 10000, "7").Int64Slice()
	}
	for _, index := range []int{0, 1, 2, 3, 4, 5} {
		database.RDB.FlushDB(ctx)
		keys[1] = "dedup:a"
		database.RDB.LPush(ctx, keys[index], "wrong")
		if _, err := accept("a"); err == nil {
			t.Fatalf("wrong type %d accepted", index)
		}
		if index != 0 {
			if n := database.RDB.XLen(ctx, visitStream).Val(); n != 0 {
				t.Fatalf("partial XADD on type error %d", index)
			}
		}
	}
	database.RDB.FlushDB(ctx)
	database.RDB.Set(ctx, "counter", "invalid", 0)
	if _, e := accept("a"); e == nil {
		t.Fatal("malformed counter accepted")
	}
	if database.RDB.XLen(ctx, visitStream).Val() != 0 {
		t.Fatal("partial mutation")
	}
	database.RDB.Set(ctx, "counter", 10, 0)
	v, e := accept("a")
	if e != nil || v[0] != 1 || v[1] != 11 {
		t.Fatalf("accept %v %v", v, e)
	}
	v, e = accept("a")
	if e != nil || v[0] != 0 || v[1] != 11 {
		t.Fatalf("duplicate %v %v", v, e)
	}
	v, e = accept("b")
	if e != nil || v[0] != -1 {
		t.Fatalf("full %v %v", v, e)
	}
	if database.RDB.Get(ctx, "counter").Val() != "11" {
		t.Fatal("full queue incremented counter")
	}
	// Moving work into Pending does not free queue capacity.
	database.RDB.XGroupCreate(ctx, visitStream, visitGroup, "0")
	database.RDB.XReadGroup(ctx, &redis.XReadGroupArgs{Group: visitGroup, Consumer: "test", Streams: []string{visitStream, ">"}, Count: 1})
	v, e = accept("c")
	if e != nil || v[0] != -1 {
		t.Fatalf("pending capacity %v %v", v, e)
	}
}

func TestEventValidationWindow(t *testing.T) {
	now := time.Now().Truncate(time.Millisecond)
	e := VisitEvent{EventID: fmt.Sprintf("%d-%s", now.UnixMilli(), randomID()), ArticleID: 1, OccurredAt: now}
	if err := validateEvent(e, true); err != nil {
		t.Fatal(err)
	}
	e.OccurredAt = now.Add(-11 * time.Minute)
	e.EventID = fmt.Sprintf("%d-%s", e.OccurredAt.UnixMilli(), randomID())
	if validateEvent(e, true) == nil {
		t.Fatal("expired retry admitted")
	}
	if err := validateEvent(e, false); err != nil {
		t.Fatal("old pending event must remain consumable", err)
	}
}

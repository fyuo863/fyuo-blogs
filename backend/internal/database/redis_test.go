package database

import (
	"context"
	"errors"
	"fmt"
	"net"
	"strconv"
	"sync"
	"testing"
	"time"

	"myblog/internal/config"
	"myblog/log"
	"os"

	"github.com/alicebob/miniredis/v2"
	"github.com/redis/go-redis/v9"
)

func TestMain(m *testing.M) {
	log.LogSetting()
	os.Exit(m.Run())
}

// setupTestRedis starts a miniredis instance, initializes the global RDB,
// and returns a cleanup function. Caller should defer the cleanup.
func setupTestRedis(t *testing.T) (*miniredis.Miniredis, func()) {
	t.Helper()

	mr, err := miniredis.Run()
	if err != nil {
		t.Fatalf("failed to start miniredis: %v", err)
	}

	host, portStr, err := net.SplitHostPort(mr.Addr())
	if err != nil {
		mr.Close()
		t.Fatalf("failed to parse miniredis addr: %v", err)
	}
	port, _ := strconv.Atoi(portStr)

	cfg := &config.RedisConfig{
		Host:         host,
		Port:         port,
		Password:     "",
		DB:           0,
		PoolSize:     10,
		QueryTimeout: 5 * time.Second,
	}

	if err := InitRedis(cfg); err != nil {
		mr.Close()
		t.Fatalf("failed to initialize Redis: %v", err)
	}

	cleanup := func() {
		CloseRedis()
		mr.Close()
	}
	return mr, cleanup
}

func TestInitRedis_Success(t *testing.T) {
	_, cleanup := setupTestRedis(t)
	defer cleanup()

	if RDB == nil {
		t.Fatal("expected RDB to be initialized, got nil")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	if err := RDB.Ping(ctx).Err(); err != nil {
		t.Fatalf("ping failed after init: %v", err)
	}
}

func TestInitRedis_Failure(t *testing.T) {
	cfg := &config.RedisConfig{
		Host:         "192.0.2.1", // TEST-NET-1, guaranteed unreachable
		Port:         9999,
		Password:     "",
		DB:           0,
		PoolSize:     1,
		QueryTimeout: 500 * time.Millisecond,
	}

	err := InitRedis(cfg)
	if err == nil {
		t.Fatal("expected error connecting to invalid address, got nil")
	}
}

func TestRedisSetGet(t *testing.T) {
	_, cleanup := setupTestRedis(t)
	defer cleanup()

	ctx := context.Background()
	key := "test:key"
	value := "hello world"

	if err := RDB.Set(ctx, key, value, 0).Err(); err != nil {
		t.Fatalf("SET failed: %v", err)
	}

	got, err := RDB.Get(ctx, key).Result()
	if err != nil {
		t.Fatalf("GET failed: %v", err)
	}
	if got != value {
		t.Fatalf("GET returned %q, want %q", got, value)
	}
}

func TestRedisGet_NotFound(t *testing.T) {
	_, cleanup := setupTestRedis(t)
	defer cleanup()

	ctx := context.Background()

	_, err := RDB.Get(ctx, "nonexistent:key").Result()
	if !errors.Is(err, redis.Nil) {
		t.Fatalf("expected redis.Nil for missing key, got: %v", err)
	}
}

func TestRedisDel(t *testing.T) {
	_, cleanup := setupTestRedis(t)
	defer cleanup()

	ctx := context.Background()
	key := "test:del"

	RDB.Set(ctx, key, "val", 0)

	deleted, err := RDB.Del(ctx, key).Result()
	if err != nil {
		t.Fatalf("DEL failed: %v", err)
	}
	if deleted != 1 {
		t.Fatalf("DEL deleted %d keys, want 1", deleted)
	}

	exists, err := RDB.Exists(ctx, key).Result()
	if err != nil {
		t.Fatalf("EXISTS failed: %v", err)
	}
	if exists != 0 {
		t.Fatalf("key should not exist after DEL, but EXISTS returned %d", exists)
	}
}

func TestRedisExpire(t *testing.T) {
	mr, cleanup := setupTestRedis(t)
	defer cleanup()

	ctx := context.Background()
	key := "test:expire"

	RDB.Set(ctx, key, "val", 100*time.Millisecond)

	// Key should exist immediately
	exists, err := RDB.Exists(ctx, key).Result()
	if err != nil {
		t.Fatalf("EXISTS failed: %v", err)
	}
	if exists != 1 {
		t.Fatal("key should exist right after SET with TTL")
	}

	// Fast-forward miniredis time past TTL
	mr.FastForward(150 * time.Millisecond)

	exists, err = RDB.Exists(ctx, key).Result()
	if err != nil {
		t.Fatalf("EXISTS failed: %v", err)
	}
	if exists != 0 {
		t.Fatal("key should have expired after TTL")
	}
}

func TestRedisHSetHGet(t *testing.T) {
	_, cleanup := setupTestRedis(t)
	defer cleanup()

	ctx := context.Background()
	key := "test:hash"
	fields := map[string]interface{}{"name": "alice", "age": "30"}

	if err := RDB.HSet(ctx, key, fields).Err(); err != nil {
		t.Fatalf("HSET failed: %v", err)
	}

	name, err := RDB.HGet(ctx, key, "name").Result()
	if err != nil {
		t.Fatalf("HGET failed: %v", err)
	}
	if name != "alice" {
		t.Fatalf("HGET name returned %q, want %q", name, "alice")
	}

	// HGet on non-existent field
	_, err = RDB.HGet(ctx, key, "nonexistent").Result()
	if !errors.Is(err, redis.Nil) {
		t.Fatalf("expected redis.Nil for missing hash field, got: %v", err)
	}
}

func TestRedisIncr(t *testing.T) {
	_, cleanup := setupTestRedis(t)
	defer cleanup()

	ctx := context.Background()
	key := "test:counter"

	RDB.Del(ctx, key) // ensure clean state

	for i := int64(1); i <= 5; i++ {
		val, err := RDB.Incr(ctx, key).Result()
		if err != nil {
			t.Fatalf("INCR #%d failed: %v", i, err)
		}
		if val != i {
			t.Fatalf("INCR #%d returned %d, want %d", i, val, i)
		}
	}
}

func TestCloseRedis(t *testing.T) {
	_, cleanup := setupTestRedis(t)
	// Don't defer — we'll close manually
	_ = cleanup

	if RDB == nil {
		t.Fatal("RDB should not be nil before close")
	}

	CloseRedis()

	// After close, operations should fail
	ctx := context.Background()
	err := RDB.Ping(ctx).Err()
	if err == nil {
		t.Fatal("expected error after closing Redis, got nil")
	}
}

func TestConcurrentAccess(t *testing.T) {
	_, cleanup := setupTestRedis(t)
	defer cleanup()

	ctx := context.Background()
	key := "test:concurrent"
	var wg sync.WaitGroup

	// Concurrent writes
	for i := 0; i < 20; i++ {
		wg.Add(1)
		go func(i int) {
			defer wg.Done()
			k := fmt.Sprintf("%s:%d", key, i)
			if err := RDB.Set(ctx, k, i, 30*time.Second).Err(); err != nil {
				t.Errorf("concurrent SET %d failed: %v", i, err)
			}
		}(i)
	}
	wg.Wait()

	// Verify all keys
	for i := 0; i < 20; i++ {
		k := fmt.Sprintf("%s:%d", key, i)
		val, err := RDB.Get(ctx, k).Result()
		if err != nil {
			t.Errorf("concurrent GET %d failed: %v", i, err)
			continue
		}
		if val != strconv.Itoa(i) {
			t.Errorf("concurrent GET %d returned %q, want %q", i, val, strconv.Itoa(i))
		}
	}
}

func TestContextTimeout(t *testing.T) {
	_, cleanup := setupTestRedis(t)
	defer cleanup()

	// Use an already-expired context
	ctx, cancel := context.WithDeadline(context.Background(), time.Now().Add(-1*time.Second))
	defer cancel()

	err := RDB.Ping(ctx).Err()
	if err == nil {
		t.Fatal("expected context deadline error, got nil")
	}
}

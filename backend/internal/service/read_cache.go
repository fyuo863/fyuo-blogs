package service

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	randv2 "math/rand/v2"
	"strings"
	"sync/atomic"
	"time"

	"golang.org/x/sync/singleflight"
	"gorm.io/gorm"
	"myblog/internal/database"
	"myblog/internal/model"
	"myblog/internal/repository"
	"myblog/log"
)

const cacheEpoch = "blog:v2:epoch"
const cacheWriter = "blog:v2:writer"

var ErrReadBusy = errors.New("article origin busy")
var originSlots = make(chan struct{}, 8)
var readerSlots = make(chan struct{}, 256)
var readFlights singleflight.Group
var cacheHits, cacheMisses, originRejected atomic.Uint64

func randomID() string {
	var b [16]byte
	if _, err := rand.Read(b[:]); err != nil {
		panic(err)
	}
	return hex.EncodeToString(b[:])
}

// A persistent write barrier prevents stale fills from becoming visible after a
// mutation. It deliberately has no lease: crash recovery must rotate the epoch
// before releasing a stranded barrier. Reads then use the bounded SQL fallback.
func beginArticleWrite(ctx context.Context) (func(), error) {
	if database.RDB == nil {
		return nil, ErrCounterUnavailable
	}
	token := randomID()
	ok, err := database.RDB.SetNX(ctx, cacheWriter, token, 0).Result()
	if err != nil {
		return nil, err
	}
	if !ok {
		return nil, ErrReadBusy
	}
	return func() {
		cleanup, cancel := context.WithTimeout(context.Background(), time.Second)
		defer cancel()
		err := database.RDB.Eval(cleanup, `if redis.call('GET',KEYS[1]) == ARGV[1] then redis.call('SET',KEYS[2],ARGV[2]); return redis.call('DEL',KEYS[1]) end return 0`, []string{cacheWriter, cacheEpoch}, token, randomID()).Err()
		if err != nil && log.Logger != nil {
			log.Logger.Error("article cache barrier retained; inspect before recovery", "error", err)
		}
	}, nil
}

func readEpoch(ctx context.Context) (string, bool) {
	ctx, cancel := context.WithTimeout(ctx, 150*time.Millisecond)
	defer cancel()
	if database.RDB == nil {
		return "", false
	}
	// One atomic read: never pair an old epoch with an absent writer.
	pipe := database.RDB.Pipeline()
	epochCmd := pipe.MGet(ctx, cacheEpoch, cacheWriter)
	serverCmd := pipe.Info(ctx, "server")
	_, err := pipe.Exec(ctx)
	vals, e := epochCmd.Result()
	if err == nil {
		err = e
	}
	// A Redis restart/failover must not resurrect cached content from an older
	// persisted epoch. The server run_id is part of every content namespace.
	var runID string
	for _, line := range strings.Split(serverCmd.Val(), "\n") {
		if strings.HasPrefix(line, "run_id:") {
			runID = strings.TrimSpace(strings.TrimPrefix(line, "run_id:"))
		}
	}
	if runID == "" {
		return "", false
	}
	if err != nil || vals[1] != nil {
		return "", false
	}
	if vals[0] == nil {
		if err = database.RDB.SetNX(ctx, cacheEpoch, randomID(), 0).Err(); err != nil {
			return "", false
		}
		return readEpoch(ctx)
	}
	epoch, ok := vals[0].(string)
	return runID + ":" + epoch, ok
}

// JSON bytes are shared by singleflight, never mutable Article slices.
func cachedRead(ctx context.Context, suffix string, load func(context.Context) (any, error)) ([]byte, error) {
	select {
	case readerSlots <- struct{}{}:
		defer func() { <-readerSlots }()
	default:
		originRejected.Add(1)
		return nil, ErrReadBusy
	}
	ctx, cancel := context.WithTimeout(ctx, 3*time.Second)
	defer cancel()
	epoch, enabled := readEpoch(ctx)
	key := "blog:v2:content:" + epoch + ":" + suffix
	read := func() ([]byte, bool) {
		if !enabled {
			return nil, false
		}
		probe, cancel := context.WithTimeout(ctx, 150*time.Millisecond)
		defer cancel()
		b, e := database.RDB.Get(probe, key).Bytes()
		return b, e == nil
	}
	if b, ok := read(); ok {
		cacheHits.Add(1)
		return b, nil
	}
	cacheMisses.Add(1)
	// Do is synchronous: at most readerSlots waiters, no goroutine per waiter.
	v, err, _ := readFlights.Do(key, func() (any, error) {
		if b, ok := read(); ok {
			return b, nil
		}
		select {
		case originSlots <- struct{}{}:
			defer func() { <-originSlots }()
		default:
			originRejected.Add(1)
			return nil, ErrReadBusy
		}
		value, e := load(ctx)
		missing := errors.Is(e, gorm.ErrRecordNotFound) || errors.Is(e, ErrArticleNotFound)
		if e != nil && !missing {
			return nil, e
		}
		var b []byte
		if missing {
			b = []byte("null")
		} else {
			b, e = json.Marshal(value)
			if e != nil {
				return nil, e
			}
		}
		if enabled {
			ttl := time.Duration(45+randv2.IntN(30)) * time.Second
			if missing {
				ttl = time.Duration(3+randv2.IntN(3)) * time.Second
			}
			// Old generations expire; they are never selected after writer completion.
			write, cancel := context.WithTimeout(ctx, 150*time.Millisecond)
			_ = database.RDB.Set(write, key, b, ttl).Err()
			cancel()
		}
		return b, nil
	})
	if err != nil {
		return nil, err
	}
	return v.([]byte), nil
}

func cachedArticle(ctx context.Context, id uint) (model.Article, error) {
	b, err := cachedRead(ctx, fmt.Sprintf("article:%d", id), func(ctx context.Context) (any, error) {
		return repository.NewArticleRepository(database.DB.WithContext(ctx)).GetVisible(id)
	})
	var a model.Article
	if err != nil {
		return a, err
	}
	if string(b) == "null" {
		return a, ErrArticleNotFound
	}
	err = json.Unmarshal(b, &a)
	return a, err
}

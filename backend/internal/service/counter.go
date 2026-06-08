package service

import (
	"context"
	"crypto/sha256"
	"errors"
	"fmt"
	"myblog/internal/database"
	"myblog/internal/model"
	"myblog/log"
	"strconv"
	"strings"
	"time"

	"github.com/redis/go-redis/v9"
	"gorm.io/gorm"
)

var ErrCounterUnavailable = errors.New("counter store unavailable")

// HashIP returns the first 16 hex characters of a SHA-256 hash.
func HashIP(ip string) string {
	h := sha256.Sum256([]byte(ip))
	return fmt.Sprintf("%x", h[:8])
}

const (
	viewCounterKey  = "article:views:%d"
	likeCounterKey  = "article:likes:%d"
	likeDedupSetKey = "article:liked:%d"
	likeDedupTTL    = 7 * 24 * time.Hour
)

const incrementCounterScript = `
local key = KEYS[1]
local base = tonumber(ARGV[1])
if redis.call("EXISTS", key) == 0 then
  redis.call("SET", key, base)
end
return redis.call("INCR", key)
`

const toggleLikeScript = `
local setKey = KEYS[1]
local countKey = KEYS[2]
local member = ARGV[1]
local base = tonumber(ARGV[2])
local ttl = tonumber(ARGV[3])

if redis.call("EXISTS", countKey) == 0 then
  redis.call("SET", countKey, base)
end

if redis.call("SISMEMBER", setKey, member) == 1 then
  redis.call("SREM", setKey, member)
  local current = tonumber(redis.call("GET", countKey) or "0")
  if current > 0 then
    current = redis.call("DECR", countKey)
  else
    redis.call("SET", countKey, 0)
    current = 0
  end
  return {0, current}
end

redis.call("SADD", setKey, member)
redis.call("EXPIRE", setKey, ttl)
return {1, redis.call("INCR", countKey)}
`

type CountSnapshot struct {
	ViewCount int `json:"view_count"`
	LikeCount int `json:"like_count"`
}

type LikeResult struct {
	Liked     bool `json:"liked"`
	LikeCount int  `json:"like_count"`
}

// IncrementView verifies the article exists, then atomically increments its Redis view counter.
func IncrementView(ctx context.Context, articleID uint) (CountSnapshot, error) {
	base, err := articleBaseCounts(ctx, articleID)
	if err != nil {
		return CountSnapshot{}, err
	}
	if database.RDB == nil {
		return CountSnapshot{}, ErrCounterUnavailable
	}

	count, err := incrementCounter(ctx, fmt.Sprintf(viewCounterKey, articleID), base.ViewCount)
	if err != nil {
		return CountSnapshot{}, err
	}
	return CountSnapshot{ViewCount: count, LikeCount: currentLikeCount(ctx, articleID, base.LikeCount)}, nil
}

// ToggleLike verifies the article exists, then atomically toggles the caller's like state.
func ToggleLike(ctx context.Context, articleID uint, ipHash string) (LikeResult, error) {
	base, err := articleBaseCounts(ctx, articleID)
	if err != nil {
		return LikeResult{}, err
	}
	if database.RDB == nil {
		return LikeResult{}, ErrCounterUnavailable
	}
	return toggleLikeCounter(ctx, articleID, ipHash, base.LikeCount)
}

// ApplyCounts overlays live Redis counters onto DB article snapshots before sending responses.
func ApplyCounts(ctx context.Context, articles []model.Article) []model.Article {
	if database.RDB == nil || len(articles) == 0 {
		return articles
	}

	pipe := database.RDB.Pipeline()
	viewCmds := make([]*redis.StringCmd, len(articles))
	likeCmds := make([]*redis.StringCmd, len(articles))
	for i, article := range articles {
		viewCmds[i] = pipe.Get(ctx, fmt.Sprintf(viewCounterKey, article.ID))
		likeCmds[i] = pipe.Get(ctx, fmt.Sprintf(likeCounterKey, article.ID))
	}
	_, _ = pipe.Exec(ctx)

	for i := range articles {
		if value, err := viewCmds[i].Int(); err == nil {
			articles[i].ViewCount = value
		}
		if value, err := likeCmds[i].Int(); err == nil {
			articles[i].LikeCount = value
		}
	}
	return articles
}

// SyncCountsToDB flushes independent Redis counters to PostgreSQL.
func SyncCountsToDB(ctx context.Context) {
	if database.RDB == nil || database.DB == nil {
		return
	}

	log.Logger.Info("starting counter sync")

	ids := collectCounterArticleIDs(ctx)
	if len(ids) == 0 {
		return
	}

	for id := range ids {
		updates := map[string]interface{}{}
		if viewRaw, err := database.RDB.Get(ctx, fmt.Sprintf(viewCounterKey, id)).Int(); err == nil {
			updates["view_count"] = viewRaw
		}
		if likeRaw, err := database.RDB.Get(ctx, fmt.Sprintf(likeCounterKey, id)).Int(); err == nil {
			updates["like_count"] = likeRaw
		}
		if len(updates) > 0 {
			database.DB.WithContext(ctx).Model(&model.Article{}).Where("id = ?", id).Updates(updates)
		}
	}

	database.InvalidateBlogListCache()
	log.Logger.Info("counter sync completed", "articles", len(ids))
}

// StartSyncScheduler starts the periodic counter sync goroutine.
func StartSyncScheduler(ctx context.Context) {
	ticker := time.NewTicker(10 * time.Minute)
	defer ticker.Stop()

	log.Logger.Info("counter sync scheduler started", "interval", "10m")

	for {
		select {
		case <-ticker.C:
			SyncCountsToDB(ctx)
		case <-ctx.Done():
			log.Logger.Info("counter sync scheduler stopped")
			SyncCountsToDB(context.Background())
			return
		}
	}
}

func articleBaseCounts(ctx context.Context, articleID uint) (CountSnapshot, error) {
	var article model.Article
	err := database.DB.WithContext(ctx).
		Select("id", "view_count", "like_count").
		Where("id = ? AND stage != ?", articleID, "hidden").
		First(&article).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return CountSnapshot{}, ErrArticleNotFound
	}
	if err != nil {
		return CountSnapshot{}, err
	}
	return CountSnapshot{ViewCount: article.ViewCount, LikeCount: article.LikeCount}, nil
}

func incrementCounter(ctx context.Context, key string, base int) (int, error) {
	return database.RDB.Eval(ctx, incrementCounterScript, []string{key}, base).Int()
}

func toggleLikeCounter(ctx context.Context, articleID uint, ipHash string, baseLike int) (LikeResult, error) {
	values, err := database.RDB.Eval(
		ctx,
		toggleLikeScript,
		[]string{
			fmt.Sprintf(likeDedupSetKey, articleID),
			fmt.Sprintf(likeCounterKey, articleID),
		},
		ipHash,
		baseLike,
		int(likeDedupTTL.Seconds()),
	).Slice()
	if err != nil {
		return LikeResult{}, err
	}
	if len(values) != 2 {
		return LikeResult{}, fmt.Errorf("unexpected like script response: %v", values)
	}

	liked, ok := values[0].(int64)
	if !ok {
		return LikeResult{}, fmt.Errorf("unexpected liked value: %T", values[0])
	}
	count, ok := values[1].(int64)
	if !ok {
		return LikeResult{}, fmt.Errorf("unexpected like count value: %T", values[1])
	}
	return LikeResult{Liked: liked == 1, LikeCount: int(count)}, nil
}

func currentLikeCount(ctx context.Context, articleID uint, base int) int {
	value, err := database.RDB.Get(ctx, fmt.Sprintf(likeCounterKey, articleID)).Int()
	if err != nil {
		return base
	}
	return value
}

func collectCounterArticleIDs(ctx context.Context) map[uint]struct{} {
	ids := map[uint]struct{}{}
	keys, err := counterKeys(ctx, "article:views:*")
	if err == nil {
		addCounterIDs(ids, keys)
	}
	keys, err = counterKeys(ctx, "article:likes:*")
	if err == nil {
		addCounterIDs(ids, keys)
	}
	return ids
}

func counterKeys(ctx context.Context, pattern string) ([]string, error) {
	var cursor uint64
	keys := []string{}
	for {
		batch, next, err := database.RDB.Scan(ctx, cursor, pattern, 100).Result()
		if err != nil {
			return nil, err
		}
		keys = append(keys, batch...)
		cursor = next
		if cursor == 0 {
			break
		}
	}
	return keys, nil
}

func addCounterIDs(ids map[uint]struct{}, keys []string) {
	for _, key := range keys {
		parts := strings.Split(key, ":")
		if len(parts) != 3 {
			continue
		}
		id, err := strconv.ParseUint(parts[2], 10, 64)
		if err != nil {
			continue
		}
		ids[uint(id)] = struct{}{}
	}
}

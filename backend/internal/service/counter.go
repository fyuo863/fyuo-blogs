package service

import (
	"context"
	"crypto/sha256"
	"fmt"
	"myblog/internal/database"
	"myblog/internal/model"
	"myblog/log"
	"strconv"
	"strings"
	"time"

	"gorm.io/gorm"
)

// HashIP 对客户端 IP 做单向哈希，返回前 16 位 hex 字符串
func HashIP(ip string) string {
	h := sha256.Sum256([]byte(ip))
	return fmt.Sprintf("%x", h[:8])
}

const (
	viewDeltaKey    = "article:view:%d"
	likeDeltaKey    = "article:like:%d"
	likeDedupSetKey = "article:liked:%d"
	likeDedupTTL    = 7 * 24 * time.Hour
	deltaTTL        = 48 * time.Hour
)

// IncrementView 在 Redis 中为指定文章增加一次浏览计数
func IncrementView(ctx context.Context, articleID uint) error {
	key := fmt.Sprintf(viewDeltaKey, articleID)
	if err := database.RDB.Incr(ctx, key).Err(); err != nil {
		log.Logger.Warn("Redis Incr 浏览计数失败", "article_id", articleID, "error", err)
		return err
	}
	// 首次设置 TTL，防止 key 无限堆积
	ttl, _ := database.RDB.TTL(ctx, key).Result()
	if ttl == -1 {
		database.RDB.Expire(ctx, key, deltaTTL)
	}
	return nil
}

// IncrementLike 对指定文章点赞。ipHash 用于去重。
// 返回 (true, nil) 表示点赞成功，(false, nil) 表示已点过赞。
func IncrementLike(ctx context.Context, articleID uint, ipHash string) (bool, error) {
	dedupKey := fmt.Sprintf(likeDedupSetKey, articleID)
	likeKey := fmt.Sprintf(likeDeltaKey, articleID)

	// Lua 脚本：原子性地检查 + 记录 + 递增
	luaScript := `
if redis.call('SISMEMBER', KEYS[1], ARGV[1]) == 1 then
	return 0
end
redis.call('SADD', KEYS[1], ARGV[1])
redis.call('EXPIRE', KEYS[1], ARGV[2])
redis.call('INCR', KEYS[2])
return 1
`
	result, err := database.RDB.Eval(ctx, luaScript,
		[]string{dedupKey, likeKey},
		ipHash, int(likeDedupTTL.Seconds()),
	).Int()

	if err != nil {
		log.Logger.Error("点赞 Lua 脚本执行失败", "article_id", articleID, "error", err)
		return false, err
	}
	return result == 1, nil
}

// GetViewCount 返回文章的总浏览次数 = DB 持久化数 + Redis 增量
func GetViewCount(ctx context.Context, articleID uint, dbCount int) int {
	key := fmt.Sprintf(viewDeltaKey, articleID)
	delta, err := database.RDB.Get(ctx, key).Int()
	if err != nil {
		return dbCount
	}
	return dbCount + delta
}

// GetLikeCount 返回文章的总点赞数 = DB 持久化数 + Redis 增量
func GetLikeCount(ctx context.Context, articleID uint, dbCount int) int {
	key := fmt.Sprintf(likeDeltaKey, articleID)
	delta, err := database.RDB.Get(ctx, key).Int()
	if err != nil {
		return dbCount
	}
	return dbCount + delta
}

// EnrichArticlesWithCounts 为文章列表填充实时的浏览和点赞总数
func EnrichArticlesWithCounts(ctx context.Context, articles []model.Article) []model.Article {
	for i := range articles {
		articles[i].ViewCount = GetViewCount(ctx, articles[i].ID, articles[i].ViewCount)
		articles[i].LikeCount = GetLikeCount(ctx, articles[i].ID, articles[i].LikeCount)
	}
	return articles
}

// SyncCountsToDB 将 Redis 中的浏览/点赞增量一次性同步到 PostgreSQL，
// 同步完毕后清除博客列表缓存使下次请求能拿到最新数据。
func SyncCountsToDB(ctx context.Context) {
	log.Logger.Info("开始同步浏览/点赞计数到数据库")

	// Lua 脚本：原子性地读出当前值并减去该值（即归零）
	getAndResetScript := `local val = redis.call('GET', KEYS[1]); if val then redis.call('DECRBY', KEYS[1], val); return val; end; return 0`

	sync := func(keyPattern string, dbField string) {
		keys, err := database.RDB.Keys(ctx, keyPattern).Result()
		if err != nil {
			log.Logger.Warn("扫描 Redis 计数 key 失败", "pattern", keyPattern, "error", err)
			return
		}
		for _, key := range keys {
			// 从 key 中提取 article ID
			parts := strings.Split(key, ":")
			if len(parts) < 3 {
				continue
			}
			idStr := parts[len(parts)-1]
			articleID, err := strconv.ParseUint(idStr, 10, 64)
			if err != nil {
				continue
			}

			deltaStr, err := database.RDB.Eval(ctx, getAndResetScript, []string{key}).Result()
			if err != nil {
				log.Logger.Warn("读取并重置 Redis 计数失败", "key", key, "error", err)
				continue
			}
			deltaVal, ok := deltaStr.(int64)
			if !ok || deltaVal <= 0 {
				continue
			}

			if err := database.DB.Model(&model.Article{}).
				Where("id = ?", articleID).
				Update(dbField, gorm.Expr(dbField+" + ?", deltaVal)).Error; err != nil {
				log.Logger.Warn("更新数据库计数失败", "article_id", articleID, "field", dbField, "error", err)
			}
		}
	}

	sync("article:view:*", "view_count")
	sync("article:like:*", "like_count")

	// 同步完成后使缓存失效
	database.InvalidateBlogListCache()
	log.Logger.Info("浏览/点赞计数同步完成")
}

// StartSyncScheduler 启动定时同步 goroutine，每 10 分钟执行一次
func StartSyncScheduler(ctx context.Context) {
	ticker := time.NewTicker(10 * time.Minute)
	defer ticker.Stop()

	log.Logger.Info("浏览/点赞计数同步调度器已启动 (每 10 分钟)")

	for {
		select {
		case <-ticker.C:
			SyncCountsToDB(ctx)
		case <-ctx.Done():
			log.Logger.Info("浏览/点赞计数同步调度器已停止")
			// 退出前最后同步一次
			SyncCountsToDB(context.Background())
			return
		}
	}
}

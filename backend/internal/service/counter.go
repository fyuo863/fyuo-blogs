package service

import (
	"context"
	"crypto/sha256"
	"encoding/json"
	"fmt"
	"myblog/internal/database"
	"myblog/internal/model"
	"myblog/log"
	"time"

	"gorm.io/gorm"
)

// HashIP 对客户端 IP 做单向哈希，返回前 16 位 hex 字符串
func HashIP(ip string) string {
	h := sha256.Sum256([]byte(ip))
	return fmt.Sprintf("%x", h[:8])
}

const (
	likeDedupSetKey = "article:liked:%d"
	likeDedupTTL    = 7 * 24 * time.Hour
)

// ── 缓存内计数更新辅助 ──

// updateCachedArticle 扫描所有 blogs:page:* 缓存，对匹配 articleID 的文章
// 执行 updateFn 修改其字段值，然后写回缓存。
func updateCachedArticle(ctx context.Context, articleID uint, updateFn func(article *map[string]interface{})) {
	keys, err := database.BlogListCacheKeys(ctx)
	if err != nil {
		return
	}
	for _, key := range keys {
		raw, err := database.RDB.Get(ctx, key).Result()
		if err != nil {
			continue
		}
		var pageData map[string]interface{}
		if err := json.Unmarshal([]byte(raw), &pageData); err != nil {
			continue
		}
		articles, ok := pageData["data"].([]interface{})
		if !ok {
			continue
		}
		for _, item := range articles {
			art, ok := item.(map[string]interface{})
			if !ok {
				continue
			}
			if id, ok := art["id"].(float64); ok && uint(id) == articleID {
				updateFn(&art)
				break
			}
		}
		// 写回
		updated, marshalErr := json.Marshal(pageData)
		if marshalErr == nil {
			ttl, _ := database.RDB.TTL(ctx, key).Result()
			database.RDB.Set(ctx, key, updated, ttl)
		}
	}
}

// IncrementView 在缓存中为指定文章增加一次浏览计数，缓存不存在时直接写 DB
func IncrementView(ctx context.Context, articleID uint) error {
	keys, err := database.BlogListCacheKeys(ctx)
	if err != nil || len(keys) == 0 {
		// 缓存不存在，直接写入 DB
		return database.DB.Model(&model.Article{}).
			Where("id = ?", articleID).
			Update("view_count", gorm.Expr("view_count + 1")).Error
	}

	updateCachedArticle(ctx, articleID, func(art *map[string]interface{}) {
		if v, ok := (*art)["view_count"].(float64); ok {
			(*art)["view_count"] = int(v) + 1
		} else {
			(*art)["view_count"] = 1
		}
	})
	return nil
}

// ToggleLike 切换点赞状态（仅操作缓存），同时维护 IP 去重集合。
// 返回 (true, nil) 表示已点赞，(false, nil) 表示已取消。
func ToggleLike(ctx context.Context, articleID uint, ipHash string) (bool, error) {
	dedupKey := fmt.Sprintf(likeDedupSetKey, articleID)
	delta := 1

	// 先操作去重集合
	isMember, err := database.RDB.SIsMember(ctx, dedupKey, ipHash).Result()
	if err != nil {
		return false, err
	}
	if isMember {
		database.RDB.SRem(ctx, dedupKey, ipHash)
		delta = -1
	} else {
		database.RDB.SAdd(ctx, dedupKey, ipHash)
		database.RDB.Expire(ctx, dedupKey, likeDedupTTL)
	}

	// 更新缓存中的计数
	updateCachedArticle(ctx, articleID, func(art *map[string]interface{}) {
		if v, ok := (*art)["like_count"].(float64); ok {
			(*art)["like_count"] = int(v) + delta
		} else {
			(*art)["like_count"] = max(0, delta)
		}
	})

	// 如果缓存不存在，直接写 DB
	keys, _ := database.BlogListCacheKeys(ctx)
	if len(keys) == 0 {
		database.DB.Model(&model.Article{}).
			Where("id = ?", articleID).
			Update("like_count", gorm.Expr("GREATEST(like_count + ?, 0)", delta))
	}

	return delta == 1, nil
}

// SyncCountsToDB 将缓存中的计数同步到 PostgreSQL，完成后使缓存失效
func SyncCountsToDB(ctx context.Context) {
	log.Logger.Info("开始同步浏览/点赞计数到数据库")

	keys, err := database.BlogListCacheKeys(ctx)
	if err != nil || len(keys) == 0 {
		return
	}

	// 汇总所有页面中出现的最新计数（以最新值为准）
	type counts struct{ view, like int }
	latest := map[uint]counts{}

	for _, key := range keys {
		raw, err := database.RDB.Get(ctx, key).Result()
		if err != nil {
			continue
		}
		var pageData map[string]interface{}
		if err := json.Unmarshal([]byte(raw), &pageData); err != nil {
			continue
		}
		articles, ok := pageData["data"].([]interface{})
		if !ok {
			continue
		}
		for _, item := range articles {
			art, ok := item.(map[string]interface{})
			if !ok {
				continue
			}
			id, ok := art["id"].(float64)
			if !ok {
				continue
			}
			vc, _ := art["view_count"].(float64)
			lc, _ := art["like_count"].(float64)
			latest[uint(id)] = counts{int(vc), int(lc)}
		}
	}

	for id, c := range latest {
		database.DB.Model(&model.Article{}).Where("id = ?", id).
			Updates(map[string]interface{}{
				"view_count": c.view,
				"like_count": c.like,
			})
	}

	database.InvalidateBlogListCache()
	log.Logger.Info("浏览/点赞计数同步完成", "articles", len(latest))
}

// StartSyncScheduler 启动定时同步 goroutine
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
			SyncCountsToDB(context.Background())
			return
		}
	}
}

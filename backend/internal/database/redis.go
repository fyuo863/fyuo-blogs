package database

import (
	"context"
	"myblog/internal/config"
	"myblog/log"
	"time"

	"github.com/redis/go-redis/v9"
)

var RDB *redis.Client

func InitRedis(cfg *config.RedisConfig) error {
	rdb := redis.NewClient(&redis.Options{
		Addr:     cfg.RedisAddr(),
		Password: cfg.Password,
		DB:       cfg.DB,
		PoolSize: cfg.PoolSize,
	})

	timeout := cfg.QueryTimeout
	if timeout <= 0 {
		timeout = 5 * time.Second
	}
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	if _, err := rdb.Ping(ctx).Result(); err != nil {
		_ = rdb.Close()
		return err
	}

	RDB = rdb
	log.Logger.Info("redis initialized", "addr", cfg.RedisAddr())
	return nil
}

func CloseRedis() {
	if RDB == nil {
		return
	}
	if err := RDB.Close(); err != nil {
		log.Logger.Error("failed to close redis", "error", err)
		return
	}
	log.Logger.Info("redis connection closed")
}

func RedisSet(ctx context.Context, key string, value interface{}) (string, error) {
	log.Logger.Info("RedisSet", "key", key)
	result, err := RDB.Set(ctx, key, value, 0).Result()
	if err != nil {
		log.Logger.Error("RedisSet failed", "key", key, "error", err)
		return result, err
	}
	return result, nil
}

func RedisGet(ctx context.Context, key string) (string, error) {
	result, err := RDB.Get(ctx, key).Result()
	if err != nil {
		log.Logger.Error("RedisGet failed", "key", key, "error", err)
		return result, err
	}
	return result, nil
}

func RedisDel(ctx context.Context, key string) error {
	if err := RDB.Del(ctx, key).Err(); err != nil {
		log.Logger.Error("RedisDel failed", "key", key, "error", err)
		return err
	}
	return nil
}

func RedisRPush(ctx context.Context, key string, values ...interface{}) error {
	if err := RDB.RPush(ctx, key, values...).Err(); err != nil {
		log.Logger.Error("RedisRPush failed", "key", key, "error", err)
		return err
	}
	return nil
}

func RedisLPush(ctx context.Context, key string, values ...interface{}) error {
	if err := RDB.LPush(ctx, key, values...).Err(); err != nil {
		log.Logger.Error("RedisLPush failed", "key", key, "error", err)
		return err
	}
	return nil
}

func RedisLRange(ctx context.Context, key string, start, stop int64) ([]string, error) {
	result, err := RDB.LRange(ctx, key, start, stop).Result()
	if err != nil {
		log.Logger.Error("RedisLRange failed", "key", key, "error", err)
		return nil, err
	}
	return result, nil
}

func RedisLPop(ctx context.Context, key string) (string, error) {
	result, err := RDB.LPop(ctx, key).Result()
	if err == redis.Nil {
		return "", nil
	}
	if err != nil {
		log.Logger.Error("RedisLPop failed", "key", key, "error", err)
		return "", err
	}
	return result, nil
}

func InvalidateBlogListCache() {
	if RDB == nil {
		return
	}

	ctx := context.Background()
	keys, err := BlogListCacheKeys(ctx)
	if err != nil || len(keys) == 0 {
		return
	}

	RDB.Del(ctx, keys...)
	log.Logger.Info("blog list cache invalidated", "keys_deleted", len(keys))
}

func BlogListCacheKeys(ctx context.Context) ([]string, error) {
	if RDB == nil {
		return nil, nil
	}

	var cursor uint64
	keys := []string{}
	for {
		batch, next, err := RDB.Scan(ctx, cursor, "blogs:page:*", 100).Result()
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

func RedisLLen(ctx context.Context, key string) (int64, error) {
	length, err := RDB.LLen(ctx, key).Result()
	if err != nil {
		log.Logger.Error("RedisLLen failed", "key", key, "error", err)
		return 0, err
	}
	return length, nil
}

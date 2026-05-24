package database

import (
	"context"
	"myblog/internal/config"
	"myblog/log"
	"time"

	"github.com/redis/go-redis/v9"
)

var RDB *redis.Client

// InitRedis 初始化 Redis 连接
func InitRedis(cfg *config.RedisConfig) error {
	rdb := redis.NewClient(&redis.Options{
		Addr:     cfg.RedisAddr(), // Redis 服务器地址
		Password: cfg.Password,    // Redis 密码（无密码则为空字符串）
		DB:       cfg.DB,          // Redis 数据库编号
		PoolSize: cfg.PoolSize,    // 连接池大小，高并发场景防止连接不够用
	})
	// 2. 设置超时上下文，验证连接是否成功
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	con, err := rdb.Ping(ctx).Result()
	if err != nil {
		return err
	}
	RDB = rdb
	log.Logger.Info("[Config]", "Redis初始化成功", con)
	return nil
}

// CloseRedis 关闭 Redis 连接
func CloseRedis() {
	if RDB != nil {
		if err := RDB.Close(); err != nil {
			log.Logger.Info("[Redis]", "关闭连接时发生错误", err)
			return
		}
		log.Logger.Info("[Redis] 连接已正常关闭")
	}
}

// RedisSet 设置指定键的值
func RedisSet(ctx context.Context, key string, value interface{}) (string, error) {
	log.Logger.Info("RedisSet", "key", key, "value", value)
	result, err := RDB.Set(ctx, key, value, 0).Result()
	if err != nil {
		log.Logger.Error("RedisSet 失败", "key", key, "error", err)
		return result, err
	}
	log.Logger.Info("RedisSet", "key", key, "result", result)
	return result, nil
}

// RedisGet 获取指定键的值
func RedisGet(ctx context.Context, key string) (string, error) {
	result, err := RDB.Get(ctx, key).Result()
	if err != nil {
		log.Logger.Error("RedisGet 失败", "key", key, "error", err)
		return result, err
	}
	log.Logger.Info("RedisGet", "key", key, "result", result)
	return result, nil
}

// RedisDel 删除指定键
func RedisDel(ctx context.Context, key string) error {
	err := RDB.Del(ctx, key).Err()
	if err != nil {
		log.Logger.Error("RedisDel 失败", "key", key, "error", err)
		return err
	}
	log.Logger.Info("RedisDel", "key", key)
	return nil
}

// RedisRPush 从列表右侧（尾部）推入一个或多个元素
func RedisRPush(ctx context.Context, key string, values ...interface{}) error {
	err := RDB.RPush(ctx, key, values...).Err()
	if err != nil {
		log.Logger.Error("RedisRPush 失败", "key", key, "error", err)
		return err
	}
	return nil
}

// RedisLPush 从列表左侧（头部）推入一个或多个元素
func RedisLPush(ctx context.Context, key string, values ...interface{}) error {
	err := RDB.LPush(ctx, key, values...).Err()
	if err != nil {
		log.Logger.Error("RedisLPush 失败", "key", key, "error", err)
		return err
	}
	return nil
}

// RedisLRange 获取列表指定范围内的元素
// 提示：获取所有元素可以使用 start=0, stop=-1
func RedisLRange(ctx context.Context, key string, start, stop int64) ([]string, error) {
	result, err := RDB.LRange(ctx, key, start, stop).Result()
	if err != nil {
		log.Logger.Error("RedisLRange 失败", "key", key, "error", err)
		return nil, err
	}
	return result, nil
}

// RedisLPop 从列表左侧（头部）弹出一个元素
func RedisLPop(ctx context.Context, key string) (string, error) {
	result, err := RDB.LPop(ctx, key).Result()
	if err == redis.Nil {
		log.Logger.Info("RedisLPop 列表为空", "key", key)
		return "", nil // 列表为空，没有元素可弹
	} else if err != nil {
		log.Logger.Error("RedisLPop 失败", "key", key, "error", err)
		return "", err
	}
	return result, nil
}

// InvalidateBlogListCache 清除所有博客列表的分页缓存
func InvalidateBlogListCache() {
	ctx := context.Background()
	keys, err := RDB.Keys(ctx, "blogs:page:*").Result()
	if err == nil && len(keys) > 0 {
		RDB.Del(ctx, keys...)
		log.Logger.Info("已清理旧的博客列表 Redis 缓存", "keys_deleted", len(keys))
	}
}

// RedisLLen 获取列表当前的长度
func RedisLLen(ctx context.Context, key string) (int64, error) {
	length, err := RDB.LLen(ctx, key).Result()
	if err != nil {
		log.Logger.Error("RedisLLen 失败", "key", key, "error", err)
		return 0, err
	}
	return length, nil
}

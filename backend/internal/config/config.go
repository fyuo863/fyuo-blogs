package config

import (
	"fmt"
	"strings"
	"time"

	"github.com/spf13/viper"
)

type Config struct {
	Server   ServerConfig   `mapstructure:"server"`
	Database DatabaseConfig `mapstructure:"database"`
	Redis    RedisConfig    `mapstructure:"redis"`
}

type ServerConfig struct {
	Host string `mapstructure:"host"` // 服务监听地址
	Port int    `mapstructure:"port"` // 服务监听端口
	Mode string `mapstructure:"mode"` // Gin 运行模式: debug / release / test
}

type DatabaseConfig struct {
	Host            string `yaml:"host"`
	Port            int    `yaml:"port"`
	User            string `yaml:"user"`
	Password        string `yaml:"password"`
	DBName          string `yaml:"dbname"`
	SSLMode         string `yaml:"sslmode"`
	TimeZone        string `yaml:"timezone"`
	MaxIdleConns    int    `yaml:"max_idle_conns"`
	MaxOpenConns    int    `yaml:"max_open_conns"`
	ConnMaxLifetime int    `yaml:"conn_max_lifetime"`
}

type RedisConfig struct {
	Host         string        `mapstructure:"host"`
	Port         int           `mapstructure:"port"`
	Password     string        `mapstructure:"password"`
	DB           int           `mapstructure:"db"`            // Redis 数据库编号
	PoolSize     int           `mapstructure:"pool_size"`     // 连接池大小
	QueryTimeout time.Duration `mapstructure:"query_timeout"` // 单次操作超时时间
}

func Load(configPath string) (*Config, error) {
	viper.SetConfigFile(configPath)
	viper.SetConfigType("yaml")
	// 支持环境变量覆盖: APP_SERVER_PORT -> server.port
	viper.SetEnvPrefix("APP")
	viper.SetEnvKeyReplacer(strings.NewReplacer(".", "_"))
	viper.AutomaticEnv()
	if err := viper.ReadInConfig(); err != nil {
		return nil, fmt.Errorf("读取配置文件失败: %w", err)
	}

	var cfg Config
	if err := viper.Unmarshal(&cfg); err != nil {
		return nil, fmt.Errorf("解析配置文件失败: %w", err)
	}

	return &cfg, nil
}

func (s *ServerConfig) ServeAddr() string {
	return fmt.Sprintf("%s:%d", s.Host, s.Port)
}
func (r *RedisConfig) RedisAddr() string {
	return fmt.Sprintf("%s:%d", r.Host, r.Port)
}
func (d *DatabaseConfig) DatabaseAddr() string {
	return fmt.Sprintf("%s:%d", d.Host, d.Port)
}

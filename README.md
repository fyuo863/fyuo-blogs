<p align="center">
  <img src="assets/fyuo-blogs.svg" width="160" alt="fyuo_bot Logo"/>
</p>


一个个人博客平台，支持 Markdown 文章撰写、浏览计数、点赞互动、全文搜索与前后台管理。

---

## 技术栈

| 层级 | 技术 |
|---|---|
| **前端** | React · Tailwind CSS · Vite · react-markdown |
| **后端** | Go · Gin · GORM |
| **数据库** | PostgreSQL 16 (主存储) · Redis 8 (缓存 & 去重) |
| **网关** | Nginx (反向代理 + 静态资源) |
| **容器化** | Docker · Docker Compose |
| **CI/CD** | GitHub Actions → 阿里云容器镜像服务 (ACR) → 阿里云 ECS 自动部署 |
| **通知** | 钉钉机器人 (部署状态推送) |

---

## 功能特性

- **Markdown 写作** — 基于 `react-markdown` + `remark-gfm` 的所见即所得 Markdown 编辑器，支持 GFM 语法
- **文章管理** — 登录后可创建 / 编辑 / 删除文章（软删除，标记 `stage = "hidden"`）
- **全文搜索** — 基于 PostgreSQL `ILIKE` 的文章标题和内容模糊搜索
- **浏览计数** — Redis 缓存实时更新，每 10 分钟定时同步至 PostgreSQL
- **点赞去重** — 基于 IP 哈希 + Redis Set 的 7 天点赞去重，前端乐观更新
- **分层缓存策略** — 首页（前 10 篇）永不过期，其他分页缓存 1 小时；写操作自动淘汰所有分页缓存并预热首页
- **用户认证** — bcrypt 密码哈希，基于用户名+密码的身份验证
- **响应式设计** — Tailwind CSS 暗色主题，适配桌面端与移动端

---

## 项目结构

```
fyuo-blogs/
├── .github/workflows/
│   ├── ci.yml                  # 全栈代码质量检查 (Go build + Vite build)
│   └── deploy.yml              # Tag 推送自动部署到阿里云 ECS
├── backend/
│   ├── configs/
│   │   └── config.yaml         # 服务器 & 数据库连接配置
│   ├── internal/
│   │   ├── config/config.go    # 配置结构体与加载
│   │   ├── database/
│   │   │   ├── postgres.go     # PostgreSQL 连接、AutoMigrate、CRUD
│   │   │   ├── redis.go        # Redis 连接 & 缓存工具
│   │   │   └── redis_test.go   # Redis 单元测试
│   │   ├── handler/
│   │   │   ├── blog.go         # 文章 CRUD API 处理器
│   │   │   ├── counter.go      # 浏览/点赞计数 API
│   │   │   └── user.go         # 用户登录 API
│   │   ├── model/
│   │   │   └── artical.go      # User / Article / Comment 数据模型
│   │   ├── router/
│   │   │   └── router.go       # Gin 路由注册 & CORS 中间件
│   │   └── service/
│   │       └── counter.go      # 计数服务 (缓存更新、定时同步、IP 去重)
│   └── main.go                 # 应用入口
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── BlogPost.jsx    # 文章详情/编辑器组件
│   │   │   ├── MarkdownEditor.jsx  # Markdown 编辑器
│   │   │   └── SignInModal.jsx # 登录弹窗
│   │   ├── module/
│   │   │   ├── Navbar.jsx      # 全局导航栏
│   │   │   ├── FeatureCard.jsx # 首页 Feature 卡片
│   │   │   ├── ProjectCard.jsx # 项目卡片
│   │   │   └── ProjectGrid.jsx # 项目网格
│   │   ├── pages/
│   │   │   ├── Home.jsx        # 首页 (Splash 动画 + FeatureCard + ProjectGrid)
│   │   │   └── Blog.jsx        # 博客页 (搜索 + 列表 + 详情 + 编辑)
│   │   ├── utils/
│   │   │   ├── parseBlocks.js  # Markdown 块解析
│   │   │   └── remarkCallout.js # Callout 语法插件
│   │   ├── api.js              # Axios API 封装
│   │   ├── App.jsx             # 根组件 (路由 + 全局布局)
│   │   └── main.jsx            # React 入口
│   ├── vite.config.js          # Vite 配置 (开发代理)
│   ├── tailwind.config.js
│   └── eslint.config.js
├── docker-compose.yml          # 5 服务编排 (Nginx, Frontend, Backend, PostgreSQL, Redis)
├── nginx.conf                  # Nginx 反向代理规则
└── README.md
```

---

## API 接口

基路径: `/api/v1`

### 公开接口

| 方法 | 路径 | 说明 |
|---|---|---|
| `POST` | `/signin` | 用户登录验证 |
| `GET` | `/articles` | 文章分页列表 (`?page=1&page_size=10`) |
| `GET` | `/articles/search?q=` | 全文搜索 |
| `GET` | `/articles/:id` | 单篇文章详情 |
| `POST` | `/articles/:id/view` | 浏览计数 +1 |
| `POST` | `/articles/:id/like` | 切换点赞/取消 (IP 去重) |

### 受保护接口 (需用户名+密码)

| 方法 | 路径 | 说明 |
|---|---|---|
| `POST` | `/articles` | 创建文章 |
| `PUT` | `/articles/:id` | 更新文章 |
| `DELETE` | `/articles/:id` | 删除文章 (软删除) |

---

## 本地开发

### 前提条件

- Go 1.26+
- Node.js 20+
- PostgreSQL 16+
- Redis 8+

### 1. 克隆仓库

```bash
git clone https://github.com/fyuo863/fyuo-blogs.git
cd fyuo-blogs
```

### 2. 启动基础设施

```bash
# 仅启动 PostgreSQL 和 Redis
docker compose up -d postgres redis
```

### 3. 配置环境变量

在项目根目录创建 `.env` 文件：

```env
DB_PASSWORD=your_db_password
DB_NAME=myblog
```

修改 `backend/configs/config.yaml` 中的数据库连接地址为 `localhost`（本地开发时）：

```yaml
database:
  host: "localhost"
redis:
  host: "localhost"
```

### 4. 启动后端

```bash
cd backend
go mod download
go run main.go
# 后端运行在 http://localhost:8080
```

### 5. 启动前端

```bash
cd frontend
npm install
npm run dev
# 前端运行在 http://localhost:5173
# API 请求由 Vite 代理转发到后端 8080 端口
```

---

## Docker 部署

### 构建镜像

```bash
# 后端
docker build -t blog-backend ./backend

# 前端
docker build -t blog-frontend ./frontend
```

### 一键启动所有服务

```bash
docker compose up -d
```

服务列表：

| 服务 | 端口 | 说明 |
|---|---|---|
| `nginx` | `8888` | 全局反向代理，对外唯一入口 |
| `frontend` | — | 静态资源容器（通过共享卷给 Nginx） |
| `backend` | `8080` (内部) | Go-Gin API 服务 |
| `postgres` | `5432` (宿主机回环) | 主数据库 |
| `redis` | `6380` (宿主机回环) | 缓存 & 计数 |

---

## CI/CD

### CI — 代码质量检查 (`.github/workflows/ci.yml`)

- **触发条件**: `main` 分支 Push / Pull Request / 手动触发
- **后端**: Go 1.26 编译检查 (`go build -v ./...`)
- **前端**: Node.js 20 + `npm ci` + `npm run build`

### CD — 自动部署 (`.github/workflows/deploy.yml`)

- **触发条件**: 推送 `v*` 版本 Tag（如 `v1.0.0`）/ 手动触发
- **流程**:
  1. 构建并推送后端 / 前端 Docker 镜像到阿里云 ACR
  2. SCP 上传 `docker-compose.yml` 和 `nginx.conf` 到 ECS
  3. SSH 登录 ECS → `docker compose pull && up -d`
  4. 钉钉机器人发送部署成功通知

### GitHub Secrets 配置

| Secret | 说明 |
|---|---|
| `ALIYUN_REGISTRY` | 阿里云镜像仓库地址 |
| `ALIYUN_REGISTRY_USER` | 镜像仓库用户名 |
| `ALIYUN_REGISTRY_PASSWORD` | 镜像仓库密码 |
| `ECS_HOST` | ECS 服务器 IP |
| `ECS_USER` | ECS SSH 用户 |
| `ECS_PASSWORD` | ECS SSH 密码 |
| `DINGTALK_WEBHOOK` | 钉钉机器人 Webhook 地址 |
| `DINGTALK_SECRET` | 钉钉机器人加签密钥 |

---

## 数据模型

### Article 文章

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | `uint` | 主键 |
| `title` | `varchar(255)` | 标题 |
| `content` | `text` | Markdown 正文 |
| `stage` | `varchar(20)` | 状态: `draft` / `published` / `hidden` |
| `vol` | `int` | 卷号 |
| `tags` | `text[]` | PostgreSQL 文本数组 |
| `view_count` | `int` | 浏览计数 |
| `like_count` | `int` | 点赞计数 |
| `author_id` | `uint` | 外键 → User |
| `created_at` | `timestamp` | 创建时间 |
| `updated_at` | `timestamp` | 更新时间 |

### User 用户

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | `uint` | 主键 |
| `name` | `varchar(100)` | 唯一用户名 |
| `role` | `varchar(20)` | `admin` / `visitor` |
| `password_hash` | `varchar(255)` | bcrypt 哈希密码 |

---

## License

MIT

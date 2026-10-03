# 前端构建镜像
FROM node:22-alpine AS builder
WORKDIR /app

# 利用缓存加速安装依赖
COPY package*.json ./
RUN npm ci --registry=https://registry.npmjs.org --no-audit --no-fund

# 复制源码并执行打包
COPY . .
RUN npm run build

# Runtime contains only host assets, not plugin sources, ZIPs or public assets.
FROM alpine:3.23 AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist

# 用一条没有副作用的死循环指令，确保容器挂载完成后能保持运行状态
# 这样 docker-compose 才能通过 volumes_from 或命名卷将其产物持久化出来
# 容器每次启动时，都把最新的 dist 内容强行刷新到挂载目录，然后再进入死循环
CMD ["sh", "-c", "mkdir -p /share_dist && rm -rf /share_dist/assets && cp -r /app/dist/. /share_dist/ && echo 'Frontend updated!' && sleep infinity"]

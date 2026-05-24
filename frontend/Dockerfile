# 前端构建镜像
FROM node:20-alpine
WORKDIR /app

# 利用缓存加速安装依赖
COPY package*.json ./
RUN npm install

# 复制源码并执行打包
COPY . .
RUN npm run build

# 用一条没有副作用的死循环指令，确保容器挂载完成后能保持运行状态
# 这样 docker-compose 才能通过 volumes_from 或命名卷将其产物持久化出来
CMD ["sh", "-c", "echo 'Build complete. Holding container...' && sleep infinity"]
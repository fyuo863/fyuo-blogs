# ==========================================
# 第一阶段：构建阶段 (Builder)
# ==========================================
# 使用官方轻量级的 Go 镜像作为构建环境 (版本可以根据你实际使用的 Go 版本调整，一般 latest 或 1.21-alpine 即可)
FROM golang:alpine AS builder

# 为我们的镜像设置必要的环境变量
# GO111MODULE=on: 开启 go module
# GOPROXY: 配置国内代理，加速依赖下载 (这步对国内服务器非常关键)
# CGO_ENABLED=0: 禁用 CGO，确保编译出的是纯静态链接的二进制文件，这样才能在极简的 alpine 镜像中运行
# GOOS=linux: 指定编译后的操作系统为 linux
ENV GO111MODULE=on \
    GOPROXY=https://goproxy.cn,direct \
    CGO_ENABLED=0 \
    GOOS=linux \
    GOARCH=amd64

# 移动到工作目录 /build
WORKDIR /build

# 先复制 go.mod 和 go.sum
# 这样做的目的是利用 Docker 的缓存机制：只要 go.mod 没变，每次打包就不会重新下载依赖，极大地加快打包速度
COPY go.mod go.sum ./
RUN go mod download

# 复制后端的所有源代码到容器中
COPY . .

# 编译 Go 项目，生成名为 "main" 的可执行文件
RUN go build -o main ./main.go


# ==========================================
# 第二阶段：运行阶段 (Runner)
# ==========================================
# 复用 builder 阶段，避免单独拉取 alpine:latest 时受到镜像源限制
FROM builder AS runner

# 设置最终运行的工作目录
WORKDIR /app

# 从构建阶段 (builder) 中，把编译好的二进制文件复制过来
COPY --from=builder /build/main .

# 【关键点】从构建阶段复制配置文件目录
# 因为我看到你的目录结构里有 configs/ 文件夹，如果你的 Go 代码需要读取里面的 yaml/json 配置，必须把它拷过来
COPY --from=builder /build/configs ./configs

# 暴露端口 (和你 docker-compose.yml 里 backend 映射的容器端口保持一致)
EXPOSE 8080

# 启动容器时运行我们的 Go 程序
CMD ["./main"]

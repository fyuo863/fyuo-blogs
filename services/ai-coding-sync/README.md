# Token Monitor → FYUO

无第三方 npm 依赖，Node 22+。本机客户端读取 Token Monitor 官方 JSON 自动导出，只上传白名单汇总。服务器用原子文件替换保存最新快照，拒绝较旧快照；相同快照重发幂等。没有对外开放 Docker 端口，由 Nginx 精确路由代理。

## 当前安装

- Token Monitor 自动导出：`C:\Users\23576\TokenMonitorExport`，30 秒导出周期。
- 本机运行目录：`%LOCALAPPDATA%\FyuoCodingSync`；私有 `config.json` 与 `upload-token` 仅当前用户和 SYSTEM 可访问，不提交仓库。
- 用户启动目录快捷方式：`FyuoCodingSync.lnk`，用户登录时启动，隐藏窗口后台运行，每 30 秒检查文件。有变化才上传，失败下次重试，退出后从磁盘重新读取。
- 日志：`%LOCALAPPDATA%\FyuoCodingSync\sync.log`；只记录状态与时间，不记录令牌或源数据。每次启动时超过 5 MiB 的日志滚动为 `.previous`。
- 服务器目录：`/data/blog/ai-coding-sync`；独立 Compose 项目 `blog-ai-coding`，不会被主站 Compose 的 remove-orphans 清理。
- 独立卷：`blog-ai-coding_snapshots`。主站版本升级或镜像回退不修改此卷。
- `GET https://fyuoblog.top/api/v1/showcase/ai-coding`：公开只读汇总。
- 同一路径 `PUT`：要求专用 Bearer token，最大 512 KiB。未知字段不保存，旧快照返回 409。

## 首次配置 / 重装

先将 `server.mjs`、`schema.mjs`、`compose.yml` 放到服务器目录，并生成至少 32 字符随机密钥写入 `upload-token`。文件 root:root、0600（容器已移除全部 capabilities，不能绕过文件所有者权限）。密钥不可通过命令参数、日志或公开仓库传递。

```sh
cd /data/blog/ai-coding-sync
docker compose -p blog-ai-coding up -d --wait
```

Nginx 使用仓库 `nginx.conf` 的精确匹配规则。修改后先 `nginx -t` 检查，再重建 Nginx 容器以更新单文件挂载。其他站点部署需修改 compose 中的外部网络名 `blog_default`。

本机私有配置结构：

```json
{
  "endpoint": "https://fyuoblog.top/api/v1/showcase/ai-coding",
  "exportFile": "C:\\Users\\23576\\TokenMonitorExport\\token-monitor-export.json",
  "timeZone": "Asia/Shanghai",
  "secret": "填写服务器同一专用上传密钥"
}
```

```powershell
# 配置保存在 %LOCALAPPDATA%\FyuoCodingSync\config.json 后执行
./services/ai-coding-sync/install-client.ps1
# 检查 / 停止 / 恢复
Get-Content "$env:LOCALAPPDATA/FyuoCodingSync/sync.log" -Tail 10
Get-CimInstance Win32_Process | Where-Object { $_.Name -eq 'node.exe' -and $_.CommandLine -like '*FyuoCodingSync*' } | ForEach-Object { Stop-Process -Id $_.ProcessId }
./services/ai-coding-sync/install-client.ps1
# 单次手动同步
node services/ai-coding-sync/client.mjs "$env:LOCALAPPDATA/FyuoCodingSync/config.json" --once
```

同步程序在用户登录期间运行，电脑关机/休眠时不会上传。Token Monitor 必须运行并自动导出。30 秒是检查频率，实际数据延迟还受软件采集周期影响。updatedAt 采用导出的 generatedAt，不伪造为服务器收到请求时间；软件在用量未变化时可能不重写导出，因此时间较旧并不一定代表电脑离线。

快照按 Token Monitor 的 totalTokens 直接映射，不将缓存重复相加。日期原样保留，以本机 Asia/Shanghai 日历展示；其他时区须调整客户端配置。项目、会话、设备、订阅、成本等字段不会上传。

## 验证与维护

```sh
node --test services/ai-coding-sync/sync.test.mjs
```

备份独立快照卷和私有上传密钥。轮换密钥须同时更新服务器文件与本机配置，再重启服务和本机同步程序。恢复数据时保留快照原时间；新版插件与旧版使用相同 v1 接口。

# AI Coding 个人展示页

当前插件 ai-coding@1.1.1，入口 /p/ai-coding。Apple 风格：纯白背景、系统字体、大留白、浅灰圆角分区和蓝色图表。包括今日/本月/累计概览、7/30/90 天趋势、52 周热力图、工具和模型累计排名。

## 构建与手动上传

```powershell
npm --prefix frontend run build:ai-coding
# 再次更新使用新版本
npm --prefix frontend run build:ai-coding -- 1.1.2
```

产物：frontend/plugin-packages/ai-coding-1.1.1.zip。
进入 fyuo-control. → plugins.，上传 ZIP，在 ai-coding 选择 1.1.1 并发布。原 1.0.0 数据接口兼容，无需删除插件。本次不代为上传或发布。

## 实时同步

已实现独立同步服务与本机客户端，见 [同步服务说明](../services/ai-coding-sync/README.md)。

Token Monitor 自动导出 → 本机每 30 秒检测变化 → HTTPS 认证上传 → 独立持久卷 → 插件每 30 秒读取汇总。旧版插件仍按其 60 秒周期刷新。

公开接口：/api/v1/showcase/ai-coding。frontend/plugins/ai-coding/config.json 可配置姓名和刷新周期。上传密钥不进入插件。电脑离线时保留最后快照；超过 10 分钟显示暂未更新。updatedAt 采用源文件 generatedAt，代表导出时间。Token Monitor 无变化时不导出，暂未更新也可能仅表示用量未变化。

公开 JSON 示例（零值仅表示格式，不是实际用量）：

```json
{
  "data": {
    "schemaVersion": 1,
    "updatedAt": "2026-09-28T00:00:00Z",
    "timeZone": "Asia/Shanghai",
    "totals": { "today": 0, "month": 0, "allTime": 0 },
    "daily": [{ "date": "2026-09-28", "tokens": 0 }],
    "tools": [{ "name": "Codex", "tokens": 0 }],
    "models": [{ "name": "模型名称", "tokens": 0 }]
  }
}
```

今日、本月、累计直接沿用 Token Monitor 的 totalTokens，不重复计算缓存。每日记录保留源文件日期，以 Asia/Shanghai 展示；缺失日期为无记录。只公开汇总，不包含项目、会话、设备、成本或账号信息。

验证：node --test services/ai-coding-sync/sync.test.mjs；在 frontend 运行 npx playwright test tests/ai-coding.spec.js --workers=1。模拟数据仅用于测试，不打入插件。

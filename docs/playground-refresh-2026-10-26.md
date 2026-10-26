# 快闪插件与项目封面更新

## 主站

- 精选项目与 Cover Flow 共用展示仓库请求、README 封面解析和缓存。按原配置刷新（当前 60 秒），再次访问先读已有内容；成功返回空列表会清空展示，不恢复示例项目。
- 公开展示 JSON 保存在 localStorage，按源地址区分，最多三个源，最长七天。封面使用 Cache Storage，最多 48 张、每张不超过 8 MiB、七天有效；只下载接近视口的图片。存储不可用或图片不允许跨域读取时退回普通图片加载。
- 仅缓存公开展示数据，不缓存管理令牌或管理接口。数据读取失败时保留最近记录并提示；超过七天的持久记录不作为启动数据。
- WebKit 的裁切与隔离层移到 3D 场景之外，并明确控制翻转正反面的可见性。保留拖动、键盘选择、翻转、返回焦点和减少动态效果设置。
- 插件标题右侧显示当前已发布版本的 `published_at`，以北京时间显示日期，悬停查看具体时间。没有记录时不编造日期，不增加数据库列。
- 目录页标题和按钮样式限定到宿主控件，避免覆盖嵌入插件的自身样式。

## 独立插件包

| 插件 | id / version | ZIP |
| --- | --- | --- |
| AI Coding | `ai-coding` / `1.2.0` | `frontend/plugin-packages/ai-coding-1.2.0.zip` |
| 快闪架构 | `plugin-architecture` / `1.0.0` | `frontend/plugin-packages/plugin-architecture-1.0.0.zip` |

两个包均为 v1 module、复用宿主 React，根目录只有 manifest.json、entry.js、style.css。AI Coding 保留原公共用量接口、趋势、热力图、工具和模型统计；采用站点深色、荧光绿和粉红主题，删除重复导航、宣传小字和装饰分割线。快闪架构通过三个可选区块简要介绍宿主、插件与独立发布。

```powershell
npm --prefix frontend run build:ai-coding
npm --prefix frontend run build:plugin-architecture
npm --prefix frontend run preview:playground
```

只读本地预览：`http://127.0.0.1:5182/plugins`。它使用实际构建产物和线上公共接口，禁止写入请求。也可分别打开 `/p/ai-coding`、`/p/plugin-architecture`。预览不伪造上线日期。

本次仅构建插件，未上传或发布。遵循根目录 AGENT.md 的独立发布约定，主站发布不会携带或安装插件。在管理域登录后，进入插件管理，选择 ZIP 上传草稿，再选择对应版本点击发布。AI Coding 应选择 1.2.0；新插件应选择 1.0.0。排序如需调整，最后保存顺序。

## 验证

- 前端 lint、构建、9 项单元测试通过。
- 64 项浏览器测试：63 通过，1 项可选真实 Whisper 推理测试未启用。包括历史插件、真实 ZIP 加载、空目录、管理弹窗、封面断网缓存与空列表更新、WebKit 手机透视与翻转、320/375/414/768/1440 宽度、目录与独立入口样式一致性。
- `go test ./...` 通过；新增发布日期查询另在隔离 PostgreSQL 16 中运行通过，确认取当前版本时间且不新增列。临时测试容器已移除。
- 检查了真实公共用量接口：本次验证时记录截至北京时间 2026-10-05。插件据实标记同步未更新，未把旧记录说成实时数据。此处没有修改独立用量同步服务。
- WebKit 为 Playwright 引擎验证；未进行 iPhone 真机 Safari 验收。

浏览器截图位于 `frontend/test-results/` 与 `frontend/migration-artifacts/`（忽略生成物）；插件包不包含测试数据、截图或运行报告。

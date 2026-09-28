# 插件构建规则

本文记录本项目页面插件的构建与交付契约。上传和发布是独立操作；用户只要求构建时，不得上传、发布或把测试包加入 `backend/builtin-plugins`。

## 主站独立部署（强制）

- 主站发布不得构建、携带或自动安装任何页面插件；生产启动不得恢复内置页面。插件只由管理员上传和发布。
- 主站升级不得修改插件文件、版本、发布状态或排序。保持现有数据库和 `backend_plugins` 命名卷；不得随升级删除卷。
- 首页按已发布列表第一项展示，空站保留登录和插件管理入口；不要恢复硬编码默认插件列表。
- API v1、共享运行时、props、样式变量及业务接口必须向后兼容。破坏性修改新增契约并保留旧版，升级时运行历史插件包回归。
- 详见 `docs/host-only-deployment.md`。历史 `backend/builtin-plugins` 仅供兼容测试，不打包到镜像。

## 页面与宿主契约

- 新页面优先使用 `type: "module"`、`apiVersion: 1`，入口必须是 `.js` ESM，默认导出 React 组件。不要调用 `createRoot`，不要在插件中再创建 BrowserRouter 或复制主站侧栏。
- 复用 `frontend/vite.plugins.config.js` 构建。该配置把 React、ReactDOM、JSX runtime、React Router 接到 `globalThis.__FYUO_PLUGIN_HOST_V1__`，不能打包第二份 React，也不能遗留浏览器无法解析的 npm 裸导入。
- 宿主可传入 `user`、`onOpenSignIn`、`onLogout`、`onNotify`、`drawerItems`、`showDrawer`、`portalTarget`。可选 props 必须有默认值或空值保护；公开缩略预览没有登录用户，也不应开启编辑器。
- 插件占据主内容区域，也会在独立预览文档中缩小展示。不要依赖唯一实例、主窗口尺寸或特定侧栏宽度。动画、事件监听和计时器应在卸载时清理。
- CSS 使用插件专属类名前缀和动画名；不要修改 `html`、`body`、`:root`、通用标签或宿主类。优先复用站点设计变量，并为独立展示提供默认值。支持 `prefers-reduced-motion`。
- JS/CSS/图片/字体/动态分块必须随包交付；包内资源用相对路径或 `new URL('./asset', import.meta.url)`，不能依赖本地磁盘或开发服务器。
- `module` 是管理员信任的同源代码；`permissions` 仅声明能力，不是权限沙箱。旧 `iframe` 类型仍使用宿主的 `allow-scripts` 沙箱，不传递宿主令牌。

## manifest 与 ZIP

ZIP 根目录直接放 `manifest.json` 和资源，不要多包一层文件夹。例如：

```text
manifest.json
entry.js
style.css
```

```json
{
  "id": "loading-spinner",
  "name": "加载动画测试",
  "version": "1.0.0",
  "route": "/p/loading-spinner",
  "entry": "entry.js",
  "styles": ["style.css"],
  "type": "module",
  "apiVersion": 1,
  "enabled": true,
  "navigation": { "label": "加载动画测试", "order": 40 },
  "permissions": []
}
```

- `id` 和 `version` 必须匹配 `^[a-z0-9][a-z0-9._-]{0,79}$`；`name` 非空且 UTF-8 长度不超过 160 字节。约定 route 为 `/p/<id>`；宿主按 id 寻址；栏目顺序由管理中心保存到 plugins.sort_order，公开列表按 sort_order、id 升序返回。navigation.order 是包内元数据，不覆盖管理员排序。
- `entry` 和 `styles` 必须指向实际存在的文件；module 入口后缀 `.js`，样式后缀 `.css`。
- 包内路径用 `/`，长度不超过 240；不得绝对路径、反斜杠、冒号、查询参数、片段、空路径段、`.` 或 `..`。上传校验还拒绝文件名中任意连续 `..`，不要使用这种名称。
- 最多 200 个 ZIP 条目（含目录）；ZIP ≤32 MiB，解压总量 ≤64 MiB，单文件 ≤8 MiB，manifest ≤64 KiB，路径段数 ≤8。不得符号链接或重复文件条目。
- 同一个 id/version 不可覆盖，上传过后再次测试需更换版本。`enabled: true` 不会自动发布：上传结果仍是 draft。
- 不要打包 node_modules、源码、密钥、`.env`、构建缓存或测试报告。

## 构建命令

在仓库根目录执行；依赖未安装时先运行 `npm --prefix frontend ci`。

```powershell
# 原有三个页面的独立 ZIP；不会写入后端或自动发布
npm --prefix frontend run build:plugins -- travel

# 独立加载动画测试包；只生成 plugin-dist 和 plugin-packages
npm --prefix frontend run build:loading-test
# 再次上传测试时使用新版本
npm --prefix frontend run build:loading-test -- 1.0.1
```

测试插件源码在 `frontend/plugins/loading-spinner/`，构建脚本在 `frontend/scripts/build-loading-test.mjs`。产物目录为 `frontend/plugin-dist/loading-spinner/`，ZIP 为 `frontend/plugin-packages/loading-spinner-<version>.zip`。

## 交付检查

1. 构建成功，检查 ZIP 根目录、manifest 字段、资源齐全和大小限制。
2. 使用实际打包产物在本地主站加载器中验证；可通过 Playwright 拦截 manifest/资源响应做本地验证，不调用上传和发布接口。
3. 检查主页面、侧栏实时预览、动画运行和减少动态效果设置；确认 CSS 不污染主站。
4. 交付 ZIP 绝对路径、插件 id/version、构建命令和用户手动上传步骤。未实际上传就明确说明，不将本地渲染验证称为上传链路验证。

## 上传与发布接口

管理员登录后进入 fyuo-control. → plugins.，选择 ZIP 上传草稿，再选择版本发布；上移/下移后点击“保存顺序”。上传和发布是独立按钮。对应接口使用管理员 Bearer token：

- `GET /api/v1/admin/plugins`：包含草稿、下线插件和历史版本的管理列表。
- `PUT /api/v1/admin/plugins/order`：JSON `{ "slugs": ["index", "journal", "travel"] }`，必须包含管理列表中所有插件且无重复；列表变化或无效顺序返回 409。
- `POST /api/v1/admin/plugins`：multipart 字段 `file`，上传 ZIP，成功返回 201 和草稿版本。
- `POST /api/v1/admin/plugins/<id>/publish/<version>`：发布指定版本。
- `GET /api/v1/plugins/<id>/manifest`：查看当前已发布版本。
- `POST /api/v1/admin/plugins/<id>/disable`：下线。

管理中心发布、下线和保存排序后，侧栏自动重新获取插件列表；已打开的插件页面刷新后使用新版本。打开 `/p/<id>` 查看内容。详细手动步骤见 `docs/loading-spinner-upload.md`。

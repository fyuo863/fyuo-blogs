# 页面插件迁移计划与兼容契约

## 目标和基线

将 index、journal、travel 变成可单独构建、上传、发布、回退的页面包。主站继续拥有导航、双页阅读器、登录、管理面板和提示弹窗。业务 API 的 URL、载荷、鉴权、统计口径不变。

保真基线是 e8dd7fb 加迁移开始时已有的工作区修改（地球缩放、比例尺、NASA 云层和 travel 排版），不是回退到 v0.4.6。迁移不重写页面，不调整动画参数和现有 CSS。Blog 只增加 `portalTarget` 接入参数，将文章弹层和宿主菜单放在同一层级，修复原有文章遮挡保存菜单的问题。

## 实施顺序

1. 记录基线：桌面双页、窄屏单页、三页主要元素、原始文件哈希和浏览器截图。
2. 建立宿主契约：共享同一个 React / ReactDOM / Router；沿用原 props、登录态、回调、window 事件和文档滚动上下文。
3. 每页建立单独 ESM 入口，直接导出原组件；打包静态资源和样式，生成带内容版本的 manifest 与 ZIP。
4. 将 PageContent 的静态组件替换为动态插件组件，保持原父级 DOM、双页缓冲、翻页动画和断点；旧 URL 与 /p/ URL 指向同一组件实例路径。
5. 完成后端模块包验证、历史资源读取、内置版本安装、管理员版本保护以及发布/回退；保留现有 iframe 插件兼容性。
6. 在镜像构建前构建插件，避免源码已更新而 backend 仍打包旧产物。
7. 验证构建、lint、Go 测试、真实构建产物的浏览器回归；记录测试范围和未验证项目。

## 加载和信任模型

- `type: module` 是管理员信任的页面代码，与主站同源、同一 React 树执行；它具有页面代码的完整权限。`permissions` 是能力说明，不是模块安全沙箱。发布这类包等同于部署前端代码。
- `type: iframe` 继续使用 `sandbox="allow-scripts"`；不向 iframe 传递登录令牌。旧 iframe 插件不自动升级权限。
- 核心页面选择 module 是为了保留原有动画、容器查询、滚动、portal、localStorage、路由及编辑功能。iframe 的独立文档无法保证这些行为原样保留。
- module 契约 v1：`apiVersion: 1`，默认导出 React 组件；宿主提供 React、ReactDOM、JSX runtime、React Router 的共享实例。业务组件仍接收原有 props。
- `portalTarget` 是宿主提供的弹层节点；文章、菜单、登录、管理面板和提示弹窗使用同一层叠上下文，沿用原有 z-index。
- 页面样式沿用当前全局样式契约，不进行 Shadow DOM 或选择器重写。独立版本的 CSS 仍需遵守站点设计变量和既有选择器，避免修改其他页面。
- `/`、`/blog`、`/travel` 和 `/p/index`、`/p/journal`、`/p/travel` 是兼容入口。保留 query/hash/state，工作台的 desk 请求和浏览器前进后退继续有效。
- 宽屏同时挂载多个页面时，宿主只把 `desk`/`id` 编辑指令交给当前页面，避免另一页同时打开编辑器；不改变页面业务组件。

## 验收矩阵

| 范围 | 必须保留 |
| --- | --- |
| 外壳 | 宽屏两页、三页缓冲和翻页动画；窄屏单页；菜单、页脚、登录与管理弹窗 |
| index | 网点标题、字符动画、项目卡片与图片、首页内容读取和编辑保存 |
| journal | 油墨标题动画、列表、搜索、Markdown 阅读、访客与事件 ID、阅读统计、创建/编辑/删除、上传图片；保留现有点赞 API（当前原页面没有点赞按钮） |
| travel | 地球渲染、日夜灯光、太阳/月亮、拖动惯性、键盘旋转、地点和路线、缩放、比例尺、NASA 云层、地点增删改 |
| 登录 | 页面间同一用户和 token，退出即时同步，401 回到原登录流程 |
| 发布 | 独立 ZIP、不可覆盖版本、下线不被重启恢复、手工发布不被内置包覆盖、旧版本可回退、打开的旧页面仍能加载其延迟资源 |

## 回退原则

保留旧版本目录和数据库记录，通过已有 publish 接口选择旧版本。管理员操作后，重启不得自动切回镜像内置版本。回退到旧 iframe 版本仍可加载，但其原有 iframe 功能限制不会由本次迁移替其修复。

## 构建与交付

在 `frontend` 目录运行：

```sh
npm ci
npm run build:plugins                 # 三个独立包
npm run build:plugins -- travel       # 仅更新 travel
npm run build                        # 宿主
npm test
npm run lint
npx playwright install chromium
npm run test:e2e                      # 使用构建产物，业务接口由 fixture 提供
```

插件产物位于 `backend/builtin-plugins/<id>/`，可上传 ZIP 位于 `frontend/plugin-packages/<id>-<version>.zip`。每个包有自己的入口，只包含该页面依赖的 JS 与静态图片，React 和 Router 由宿主提供。公共资源路径在构建时改为包内相对地址；业务 API 和服务器返回的图片 URL 不改。

版本为 `3.0.0-<内容哈希>`，内容变化生成新版本，内容相同保持版本稳定。ZIP 包含 manifest、入口、CSS、延迟模块及所需图片。不要手工覆盖服务器上的已有版本目录。

独立发布继续使用原接口：管理员凭据下 `POST /api/v1/admin/plugins`（multipart 字段 `file`）上传为草稿，随后 `POST /api/v1/admin/plugins/<id>/publish/<version>` 发布。下线用 `POST /api/v1/admin/plugins/<id>/disable`。选择一个已有版本重新 publish 即回退，并固定为管理员选择。

第一次迁移需要同时发布宿主与后端，因为新增 module API v1。后续同契约页面包可单独上传发布。当前打开的页面继续运行已加载版本，刷新后读取新 manifest。普通模块不能依靠 `permissions` 获得沙箱隔离；只发布管理员审核过的代码。

部署工作流会先从当前源码构建插件，再构建后端镜像。手工执行 `docker build backend` 前也必须先执行 `npm run build:plugins`。数据库使用现有 AutoMigrate 增加 `managed_by_admin`；手动 SQL 管理环境可使用 `003_plugin_management.sql`。

## 验证记录

- 基线截图和布局数据：`frontend/migration-artifacts/before/`；迁移后：`frontend/migration-artifacts/after/`。
- 1440、900、390 px 三种宽度 × 三个页面，共 9 组主要元素的位置、尺寸、字体、背景与基线一致。截图保留供目视检查；未把随时间变化的地球光照认作逐像素一致。
- Home、Travel、TravelGlobe、index.css 保持迁移前 SHA-256；Blog 除新增弹层目标参数外保留原逻辑。`api.js` 和阅读统计实现无改动。
- 构建、lint、阅读统计单元测试、PostgreSQL 插件生命周期测试和浏览器兼容测试的最终结果见 `plugin-migration-validation.md`。
- 浏览器测试使用本次真实 JS/CSS/图片产物；业务接口使用受控 fixture，覆盖路径、载荷、鉴权头、回调和页面行为。PostgreSQL 测试使用独立临时 schema，覆盖实际上传/发布/回退/下线和资源处理器。
- NASA 外部云图在可复现测试里模拟网络失败，验证地球仍可使用；未声称验证当天云图的数据可用性。线上发布、真实账号写入和生产数据修改不属于本地迁移验证。

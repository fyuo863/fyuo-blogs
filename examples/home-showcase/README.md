# 首页展示仓库

创建一个公开的 GitHub 展示仓库，把 `showcase.json` 上传到仓库根目录即可，不需要 `covers/`。每个专辑的 `url` 填对应项目的 GitHub 仓库地址，首页自动读取该仓库默认分支的 README，取第一张非徽章图片作为封面。支持 Markdown 图片、引用式图片和 HTML img，相对地址以 README 位置解析。

专辑顺序就是 `albums` 数组的顺序；新增、修改、删除或调换数组元素即可更新展示。README 没有图片、读取受限或图片加载失败时，封面显示项目名称。

`showcase.json` 格式：

| 字段 | 内容 |
| --- | --- |
| `version` | 固定为数字 `1`，表示数据格式版本 |
| `albums` | 最多 24 个专辑；空数组表示不展示专辑 |
| `id` | 唯一且稳定的英文字母（支持大小写）、数字、短横线标识，最多 80 字符，以字母或数字开头 |
| `title` | 必填标题，最多 160 字符 |
| `cover` | 可省略，自动使用项目 README 图片；兼容手动填写图片地址以覆盖自动选择 |
| `description` | 可选简介，显示在专辑背面 |
| `content` | 可选背面正文，支持 Markdown 标题、段落、列表、图片和链接，不执行 HTML |
| `repository` | 可选，格式 `owner/repo`，只用于读取 README 封面，不产生跳转按钮；省略则从 `url` 推断 |
| `url` | 项目 GitHub 仓库地址，用于读取 README 和“打开项目”；省略时显示文字封面 |

简介和正文各最多 20,000 字符，展示 JSON 最多 512 KiB。图片、链接仅支持无用户名或密码的 HTTPS 地址；Markdown 相对资源路径同样以 JSON 文件地址为基准。较长正文在专辑背面滚动。

## 首次连接

编辑主站源码中的 `frontend/plugins/index/showcase.config.json`：

```json
{
  "repository": "你的用户名/展示仓库名",
  "branch": "main",
  "path": "showcase.json",
  "refreshSeconds": 60
}
```

`branch` 使用简单分支名（字母、数字、下划线、短横线或点），`path` 使用相同字符组成的相对路径，不使用 `..`。

在主站源码根目录构建：

```powershell
npm --prefix frontend run build:plugins -- index
```

进入管理域 fyuo-control. → plugins.，上传新生成的 `frontend/plugin-packages/index-*.zip` 草稿，再发布该版本。刷新首页检查。无需部署主站。

以后只需要提交展示仓库的内容。页面打开且可见时每 60 秒检查一次，重新切回页面也会检查；GitHub CDN 缓存和访客网络会影响实际更新时间，这不是即时推送。不需要 API 密钥，不支持私有仓库。

读取失败时保留本次页面会话中最近成功的内容；尚未读取成功时使用原有首页数据并提示读取失败。刷新页面不保留上次会话的缓存。仓库留空时仍使用原来的首页数据；配置仓库后，管理中心旧项目编辑器不再控制 Selected work。

点击两侧封面将其移到中间，点击中间封面才翻至背面并放大 25%，倒影同步翻转。点击返回按钮或按 Escape 回到封面。左右按钮和拖动仍可切换专辑。

README 图片地址在当前页面会话中缓存 10 分钟，失败后至少 60 秒再试；GitHub 未认证 API 有访问频率限制。展示 JSON 仍按 60 秒检查。示例目录原有 covers/first.svg 仅供可选手动封面使用，无需上传。

`url` 不填写或设为 `""` 时不显示“打开项目”。例如只展示博客而不跳转：

```json
{"id":"fyuo-blogs","title":"个人博客","repository":"fyuo863/fyuo-blogs","description":"一个插件化的网站外壳","content":"","url":""}
```

当前插件已连接 `fyuo863/fb-basement` 的 `main/showcase.json`。

## 推荐项目展示区

与 albums 同级添加 featured 对象，支持 title、description、repository、url 和可选 cover，规则与专辑相同，无需 id。省略 featured 保留原有推荐项目；设置为 null 隐藏整块。url 留空隐藏跳转按钮，repository 独立指定 README 图片来源。更新频率和失败保留策略与专辑一致。

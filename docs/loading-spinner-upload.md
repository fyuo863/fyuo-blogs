# 加载动画插件：手动上传测试

插件 ID：`loading-spinner`；本次版本：`1.0.0`；类型：`module` / API v1。

ZIP：`frontend/plugin-packages/loading-spinner-1.0.0.zip`。包内仅有 `manifest.json`、`entry.js`、`style.css`，页面中央是持续旋转的加载环和“加载中…”文字。系统启用减少动态效果时，加载环保持静止。

本次仅构建并在浏览器中模拟加载，未向服务器上传或发布。

## 推荐：通过管理中心操作

1. 打开 http://localhost:8088，登录管理员账号。
2. 展开左侧栏，点击“管理后台”，在 fyuo-control. 中选择 `plugins.`。
3. 在“插件 ZIP”选择 `frontend/plugin-packages/loading-spinner-1.0.0.zip`，点击“上传草稿”。
4. 上传成功后，在“加载动画测试”一行选择 `1.0.0`，点击“发布版本”。
5. 点击上移/下移调整栏目顺序，然后点击“保存顺序”。侧栏会自动更新。
6. 关闭管理中心，点击新栏目，或打开 http://localhost:8088/p/loading-spinner。

相同版本重复上传会提示“该版本已存在”。要继续测试，构建新版本：`npm --prefix frontend run build:loading-test -- 1.0.1`。

以下保留控制台操作，便于排查接口问题。

## 1. 登录

打开 http://localhost:8088，展开左侧栏，点击 `log-in.`，使用你的管理员账号登录。关闭登录弹窗，按 F12 打开开发者工具的 Console（控制台）。也可以使用下列控制台操作直接调用现有接口。

## 2. 选择 ZIP 并上传草稿

在当前站点控制台执行以下代码，会打开文件选择框。选择上述 ZIP；此步骤只上传，不发布。

```javascript
(() => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (!user?.token || user.role !== 'admin') throw new Error('请先登录管理员账号');
  const picker = document.createElement('input');
  picker.type = 'file';
  picker.accept = '.zip';
  picker.onchange = async () => {
    if (!picker.files[0]) return;
    const body = new FormData();
    body.append('file', picker.files[0]);
    try {
      const response = await fetch('/api/v1/admin/plugins', {
        method: 'POST',
        headers: { Authorization: `Bearer ${user.token}` },
        body,
      });
      const result = await response.json();
      if (!response.ok) throw new Error(`${response.status}: ${result.error || '上传失败'}`);
      console.log('上传成功，尚未发布：', result.data);
    } catch (error) { console.error(error.message); }
  };
  picker.click();
})();
```

预期：Network 中 POST 返回 **201**，结果 `version` 为 `1.0.0`、`status` 为 `draft`。此时公开列表与侧栏不应出现新插件，访问 `/p/loading-spinner` 应显示“插件不可用”。

## 3. 单独发布

确认草稿上传成功后，再在控制台执行：

```javascript
await (async () => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (!user?.token || user.role !== 'admin') throw new Error('请先登录管理员账号');
  const response = await fetch('/api/v1/admin/plugins/loading-spinner/publish/1.0.0', {
    method: 'POST',
    headers: { Authorization: `Bearer ${user.token}` },
  });
  const result = await response.json();
  if (!response.ok) throw new Error(`${response.status}: ${result.error || '发布失败'}`);
  console.log(result.message);
})();
```

预期：返回 **200** 和“发布成功”。

## 4. 检查页面与侧栏

1. 刷新主站，让侧栏重新获取已发布插件列表。
2. 访问 http://localhost:8088/p/loading-spinner，应看到居中的旋转加载环。
3. 悬停展开侧栏，新栏目的实时预览也应显示旋转加载环。
4. 查看 http://localhost:8088/api/v1/plugins/loading-spinner/manifest，确认 id 和 version。

## 重复测试与下线

- 相同 id/version 不允许覆盖。重复上传当前包返回 **409 / 该版本已存在，请修改版本号后重新上传**。这不代表第一次上传失败。
- 如需新一轮上传，在仓库根目录执行 `npm --prefix frontend run build:loading-test -- 1.0.1`，上传新 ZIP，并把发布地址末尾改为 `1.0.1`。
- 401 表示未登录或令牌失效；403 表示账号没有管理员权限；400“插件包无效”应检查 manifest 与 ZIP 根目录结构。
- 测试后如需下线，在已登录控制台执行下面的独立操作，再刷新页面：

```javascript
await (async () => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (!user?.token || user.role !== 'admin') throw new Error('请先登录管理员账号');
  const response = await fetch('/api/v1/admin/plugins/loading-spinner/disable', {
    method: 'POST', headers: { Authorization: `Bearer ${user.token}` },
  });
  const result = await response.json();
  if (!response.ok) throw new Error(`${response.status}: ${result.error || '下线失败'}`);
  console.log(result.message);
})();
```

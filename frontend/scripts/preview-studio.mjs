// Isolated read-only preview. Never included in the production Vite build.
import { createServer } from 'vite';

const articles = [
  { id: 9001, title: '示例文章：从想法到项目', content: '# 从想法到项目\n\n这是本地预览的**示例文章**，用于测试列表、阅读和 Markdown 排版。\n\n## 实践记录\n\n- 首页展示项目\n- 博客承载内容\n- 插件扩展新的玩法\n\n```go\nfmt.Println("Keep making.")\n```\n\n这里的内容不会写入真实数据库。', tags: ['本地示例', '项目'], created_at: '2026-10-24T09:00:00+08:00', view_count: 0, like_count: 0, stage: 'published' },
  { id: 9002, title: '示例文章：留一点空间给实验', content: '# 留一点空间给实验\n\n这是一篇本地示例。可以搜索“实验”，打开文章，再返回列表。\n\n> 记录过程，也是项目的一部分。', tags: ['本地示例'], created_at: '2026-10-23T09:00:00+08:00', view_count: 0, like_count: 0, stage: 'published' },
];
const manifest = { id: 'local-demo', name: '本地沙箱示例', version: '1.0.0', type: 'iframe', entry: 'index.html' };
const server = await createServer({
  server: { host: '127.0.0.1', port: 5181, strictPort: true },
  plugins: [{
    name: 'read-only-studio-preview',
    transformIndexHtml(html) {
      return html.replace('<title>', '<title>本地演示 · ').replace('</body>', '<aside style="position:fixed;bottom:8px;left:50%;transform:translateX(-50%);z-index:9999;background:#eff5d9;color:#1e2020;border:1px solid #55594f;border-radius:4px;padding:6px 12px;font:11px sans-serif;white-space:nowrap;pointer-events:none">本地演示 · 示例文章与插件 · 写入已禁用</aside></body>');
    },
    configureServer(vite) {
      vite.middlewares.use((request, response, next) => {
        const url = new URL(request.url, 'http://127.0.0.1');
        const json = (data, status = 200) => { response.statusCode = status; response.setHeader('Content-Type', 'application/json; charset=utf-8'); response.end(JSON.stringify(data)); };
        if (url.pathname === '/plugin-assets/local-demo/1.0.0/index.html') {
          response.setHeader('Content-Type', 'text/html; charset=utf-8');
          response.end('<!doctype html><html lang="zh-CN"><meta name="viewport" content="width=device-width,initial-scale=1"><title>本地插件示例</title><style>body{margin:0;min-height:80vh;display:grid;place-content:center;text-align:center;background:#acfa64;color:#1e2020;font-family:sans-serif}h1{font-size:clamp(3rem,12vw,8rem);margin:0;letter-spacing:-.08em}button{padding:1rem 2rem;background:#1e2020;color:#eff5d9;border:0;font-size:1rem;cursor:pointer}</style><h1>PLAY MORE.</h1><p>这是只在本地预览提供的 iframe 沙箱示例。</p><button id="play">点击计数：0</button><script>let count=0;document.getElementById("play").onclick=function(){this.textContent="点击计数："+(++count)}</script></html>');
          return;
        }
        if (!url.pathname.startsWith('/api/')) return next();
        if (url.pathname === '/api/v1/signin' && request.method === 'POST') {
          let body = '';
          request.on('data', chunk => { body += chunk; if (body.length > 2048) request.destroy(); });
          request.on('end', () => {
            try {
              const input = JSON.parse(body);
              if (input.name !== 'demo' || input.password !== 'demo') return json({ error: '演示账号和密码均为 demo。' }, 401);
              return json({ data: { id: 99999, name: 'demo', role: 'admin', token: 'local-preview-only-not-a-real-token' } });
            } catch { return json({ error: '请求格式错误' }, 400); }
          });
          return;
        }
        if (url.pathname === '/api/v1/signout' && request.method === 'POST') return json({ message: '已退出演示' });
        if (request.method !== 'GET') {
          if (url.pathname.endsWith('/view')) return json({ view_count: 0, like_count: 0 });
          return json({ error: '本地演示不连接数据库，写入已禁用。' }, 503);
        }
        if (url.pathname === '/api/v1/home-content') return json({ data: null });
        if (url.pathname === '/api/v1/plugins') return json({ data: [{ slug: manifest.id, name: manifest.name }] });
        if (url.pathname === '/api/v1/plugins/local-demo/manifest') return json({ data: manifest });
        if (url.pathname === '/api/v1/admin/plugins') return json({ data: [{ id: 999, slug: manifest.id, name: manifest.name, status: 'published', active_version: manifest.version, versions: [{ version: manifest.version, status: 'published' }] }] });
        if (['/api/v1/visit-records', '/api/v1/admin/api-keys', '/api/v1/admin/publisher-users', '/api/v1/travel-places'].includes(url.pathname)) return json({ data: [] });
        if (url.pathname === '/api/v1/articles') return json({ data: articles });
        if (url.pathname === '/api/v1/articles/search') return json({ data: articles.filter(article => `${article.title} ${article.content}`.includes(url.searchParams.get('q') || '')) });
        const article = articles.find(item => url.pathname === `/api/v1/articles/${item.id}`);
        if (article) return json({ data: article });
        return json({ error: '本地演示没有此接口。' }, 404);
      });
    },
  }],
});
await server.listen();
server.printUrls();

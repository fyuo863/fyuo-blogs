# blog-publisher MCP

Environment variables:

```bash
BLOG_BASE_URL=http://localhost:18080
BLOG_API_KEY=blogak_xxx
# 可选回退：未配置 BLOG_API_KEY 时使用用户名密码登录
BLOG_AGENT_NAME=agent-publisher
BLOG_AGENT_PASSWORD=agent123456
BLOG_TIMEOUT_MS=10000
BLOG_DEFAULT_STAGE=published
```

Tools:

- `blog_login`
- `blog_create_post`
- `blog_update_post`
- `blog_list_posts`
- `blog_get_post`
- `blog_search_posts`

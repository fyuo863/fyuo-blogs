# blog-publisher MCP

Environment variables:

```bash
BLOG_BASE_URL=https://fyuoblog.top
BLOG_TIMEOUT_MS=10000
BLOG_DEFAULT_STAGE=published
MCP_HOST=0.0.0.0
MCP_PORT=18081
MCP_PATH=/mcp
```

Remote HTTP mode:

- Client sends its own blog API key in `X-Blog-Api-Key`
- MCP forwards that key to the blog backend as `X-API-Key`
- This lets different agents use different keys created in the admin panel

Tools:

- `blog_login`
- `blog_create_post`
- `blog_update_post`
- `blog_list_posts`
- `blog_get_post`
- `blog_search_posts`

import { startStdioServer } from "./server.js";

startStdioServer().catch((error) => {
  console.error("blog-publisher MCP failed:", error);
  process.exit(1);
});

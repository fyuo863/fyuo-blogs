import { useState, useEffect } from "react";
import axios from "axios";

function Home() {
  const [articleData, setArticleData] = useState(null);

  useEffect(() => {
    // ⚠️ 注意：这里的端口号请换成你最终确定的后端端口（8080 或 8090）
    axios
      .get("http://localhost:8080/api/v1/articles")
      .then((response) => setArticleData(response.data))
      .catch((error) => console.error("获取文章失败:", error));
  }, []);

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "800px",
        margin: "0 auto",
        fontFamily: "sans-serif",
      }}
    >
      <h1 style={{ borderBottom: "2px solid #eee", paddingBottom: "10px" }}>
        最新文章
      </h1>

      <div
        style={{
          background: "#f9f9f9",
          padding: "20px",
          borderRadius: "8px",
          marginTop: "20px",
        }}
      >
        {/* 在真实数据库连上之前，我们先以 JSON 格式展示后端返回的原始数据 */}
        <pre>
          {articleData
            ? JSON.stringify(articleData, null, 2)
            : "正在拼命加载文章数据..."}
        </pre>
      </div>
    </div>
  );
}

export default Home;

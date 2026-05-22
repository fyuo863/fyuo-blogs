import { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  // 模拟用户状态：null 代表未登录，如果有字符串（如 "Admin"）则代表已登录
  const [username, setUsername] = useState(null);

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between", // 让内容分别靠左和靠右对齐
        alignItems: "center",
        padding: "15px 40px",
        backgroundColor: "#282c34",
        color: "white",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ margin: 0 }}>
        <Link to="/" style={{ color: "white", textDecoration: "none" }}>
          🚀 全栈博客
        </Link>
      </h2>

      <div>
        {/* 根据 username 的状态决定右上角显示什么 */}
        {username ? (
          <>
            <span style={{ fontWeight: "bold", marginRight: "15px" }}>
              欢迎博主：{username}
            </span>
            {/* 点击退出，把状态重置为 null */}
            <button
              onClick={() => setUsername(null)}
              style={{
                cursor: "pointer",
                padding: "5px 10px",
                backgroundColor: "#ff4d4f",
                color: "white",
                border: "none",
                borderRadius: "4px",
              }}
            >
              模拟退出
            </button>
          </>
        ) : (
          <>
            {/* 点击登录，调用 setUsername 把状态改成 "Admin" */}
            <button
              onClick={() => setUsername("Admin")}
              style={{
                cursor: "pointer",
                marginRight: "15px",
                padding: "5px 10px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "4px",
              }}
            >
              模拟一键登录
            </button>

            <Link
              to="/signin"
              style={{
                color: "#61dafb",
                textDecoration: "none",
                fontWeight: "bold",
                border: "1px solid #61dafb",
                padding: "5px 15px",
                borderRadius: "4px",
              }}
            >
              正式登录页
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn"; // 确保你有这个文件，哪怕里面只是个空的 <div>登录页</div>

function App() {
  return (
    <BrowserRouter>
      {/* 将导航栏放在 Routes 外面，它就会固定在所有页面的顶部 */}
      <Navbar />

      {/* 这里的路由控制主体内容区域的切换 */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

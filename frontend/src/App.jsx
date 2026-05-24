import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignInModal from "./components/SignInModal";

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [showSignIn, setShowSignIn] = useState(false);

  const handleLogin = (name, password) => {
    console.log("登录按钮被点击了！");
    const u = { name, password };
    setUser(u);
    localStorage.setItem("user", JSON.stringify(u));
    setShowSignIn(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Home
              user={user}
              onOpenSignIn={() => setShowSignIn(true)}
              onLogout={handleLogout}
            />
          }
        />
      </Routes>

      <SignInModal
        open={showSignIn}
        onClose={() => setShowSignIn(false)}
        onLogin={handleLogin}
      />
    </BrowserRouter>
  );
}

export default App;

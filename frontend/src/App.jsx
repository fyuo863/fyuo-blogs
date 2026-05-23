import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignInModal from "./components/SignInModal";

function App() {
  const [username, setUsername] = useState(null);
  const [showSignIn, setShowSignIn] = useState(false);

  const handleLogin = (name) => {
    setUsername(name);
    setShowSignIn(false);
  };

  const handleLogout = () => setUsername(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Home
              username={username}
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

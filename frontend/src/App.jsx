import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar_del";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
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
      <Navbar
        username={username}
        onOpenSignIn={() => setShowSignIn(true)}
        onLogout={handleLogout}
      />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
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

import { BrowserRouter } from "react-router-dom";

import AppLayout from "./layout/AppLayout";
import { useAuth } from "./hooks/useAuth";
import { useUIStore } from "./store/useUIStore";

export default function App() {
  const { user, login, logout } = useAuth();
  const ui = useUIStore();

  return (
    <BrowserRouter>
      <AppLayout
        user={user}
        showSignIn={ui.showSignIn}
        showAdmin={ui.showAdmin}
        onOpenAdmin={() => ui.setShowAdmin(true)}
        onCloseAdmin={() => ui.setShowAdmin(false)}
        onOpenSignIn={() => ui.setShowSignIn(true)}
        onCloseSignIn={() => ui.setShowSignIn(false)}
        onLogin={login}
        onLogout={logout}
        onNotify={ui.notify}
        info={ui.info}
        setInfo={ui.setInfo}
      />
    </BrowserRouter>
  );
}
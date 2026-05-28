import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Home({ user, onOpenSignIn, onLogout }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const MENU_ITEMS = [{ label: "exit.", action: "logout" }];

  const handleMenuAction = (action) => {
    setMenuOpen(false);
    if (action === "logout") onLogout();
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      {/* 主内容区 */}
      <div className="text-center">
        <p className="text-zinc-500 text-lg font-bold tracking-tight mb-8">
          thoughts, code, and everything in between.
        </p>
        <button
          onClick={() => navigate("/blog")}
          className="px-8 py-3 text-lg font-bold tracking-tight text-white border border-zinc-700 hover:bg-white hover:text-black hover:border-white transition-all duration-300"
        >
          enter.
        </button>
      </div>

      {/* 左下角菜单 */}
      <div className="fixed bottom-0 left-0 z-[60] px-4 py-4 sm:px-6 lg:px-8">
        {user ? (
          <div className="flex flex-col items-start">
            <div
              className={`flex flex-col items-start overflow-hidden transition-all duration-300 ease-out ${
                menuOpen ? "max-h-60 opacity-100 mb-2" : "max-h-0 opacity-0"
              }`}
            >
              {MENU_ITEMS.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleMenuAction(item.action)}
                  className="text-lg font-bold tracking-tight text-zinc-500 hover:text-white transition-colors py-0.5"
                >
                  {item.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-lg font-bold tracking-tight text-white hover:text-zinc-300 transition-colors"
            >
              home.
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenSignIn}
            className="text-lg font-bold tracking-tight text-zinc-500 hover:text-white transition-colors"
          >
            log-in.
          </button>
        )}
      </div>
    </div>
  );
}

export default Home;

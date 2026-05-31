import { useState } from "react";
import FeatureCard from "../module/FeatureCard";
import ProjectGrid from "../module/ProjectGrid";

const PROJECTS = [
  {
    image: "/fyuo-blogs.svg",
    title: "fyuo-blogs.",
    linkUrl: "https://github.com/fyuo863/fyuo-blogs",
    description: "个人博客项目(即本网站)",
  },
  {
    image: "/go-file-fetch.svg",
    title: "go-file-fetch",
    linkUrl: "https://github.com/fyuo863/go-file-fetch",
    description: "简单的多线程文件下载器",
  },
  {
    image: "/fyuo-bot.svg",
    title: "fyuo-bot",
    linkUrl: "https://github.com/fyuo863/fyuo_bot",
    description: "一个轻量化的 Agent 框架.",
  },
];

function Home({ user, onOpenSignIn, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const MENU_ITEMS = [{ label: "exit.", action: "logout" }];

  const handleMenuAction = (action) => {
    setMenuOpen(false);
    if (action === "logout") onLogout();
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center">
      {/* 主内容区 */}
      <div className="w-full px-[10%] py-24 flex flex-col gap-32">
        <FeatureCard
          image="/fyuo-bot.svg"
          title="fyuo-bot 一个轻量化的 Agent 框架"
          githubUrl="https://github.com/fyuo863"
          description="思考、计划、编码、记忆."
        />

        <ProjectGrid title="projects." projects={PROJECTS} />
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

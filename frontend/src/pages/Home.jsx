import FeatureCard from "../module/FeatureCard";
import ProjectGrid from "../module/ProjectGrid";
import AppDrawer from "../components/AppDrawer";

const PROJECTS = [
  {
    image: "/fyuo-blogs.svg",
    title: "fyuo-blogs.",
    linkUrl: "https://github.com/fyuo863/fyuo-blogs",
    description: "个人博客项目(即本网站).",
  },
  {
    image: "/go-file-fetch.svg",
    title: "go-file-fetch",
    linkUrl: "https://github.com/fyuo863/go-file-fetch",
    description: "简单的多线程文件下载器.",
  },
  {
    image: "/fyuo-bot.svg",
    title: "fyuo-bot",
    linkUrl: "https://github.com/fyuo863/fyuo_bot",
    description: "一个轻量化的 Agent 框架.",
  },
  {
    image: "/fyuo-ops.svg",
    title: "fyuo-ops",
    linkUrl: "https://github.com/fyuo863/fyuo-ops",
    description: "运维特化 Agent.",
  },
  {
    image: "/fyuobot-ts.svg",
    title: "fyuobot-ts",
    linkUrl: "https://github.com/fyuo863/fyuobot-ts",
    description: "TypeScript 版本的模块化 Agent 框架.",
  },
  {
    image: "/fyuobot-ts-tools.svg",
    title: "fyuobot-ts-tools",
    linkUrl: "https://github.com/fyuo863/fyuobot-ts-tools",
    description: "fyuobot-ts 使用的工具集.",
  },
];

function Home({ user, onOpenSignIn, drawerItems }) {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center">
      {/* 主内容区 */}
      <div className="w-full px-[10%] py-24 flex flex-col gap-32">
        <FeatureCard
          image="/fyuobot-ts.svg"
          title="fyuobot-ts"
          githubUrl="https://github.com/fyuo863/fyuobot-ts"
          description="事件驱动的轻量化 Agent 框架."
        />

        <ProjectGrid title="projects." projects={PROJECTS} />
      </div>

      {/* 左下角菜单 */}
      <AppDrawer
        user={user}
        label="home."
        items={drawerItems}
        onOpenSignIn={onOpenSignIn}
      />
    </div>
  );
}

export default Home;

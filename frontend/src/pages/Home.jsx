import FeatureCard from "../module/FeatureCard";
import ProjectGrid from "../module/ProjectGrid";
import AppDrawer from "../components/AppDrawer";
import PhysicsItem from "../physics/PhysicsItem";

const PROJECTS = [
  { image: "/fyuo-blogs.svg", title: "fyuo-blogs.", linkUrl: "https://github.com/fyuo863/fyuo-blogs", description: "个人博客项目(即本网站)." },
  { image: "/go-file-fetch.svg", title: "go-file-fetch", linkUrl: "https://github.com/fyuo863/go-file-fetch", description: "简单的多线程文件下载器." },
  { image: "/fyuo-bot.svg", title: "fyuo-bot", linkUrl: "https://github.com/fyuo863/fyuo_bot", description: "一个轻量化的 Agent 框架." },
  { image: "/fyuo-ops.svg", title: "fyuo-ops", linkUrl: "https://github.com/fyuo863/fyuo-ops", description: "运维特化 Agent." },
  { image: "/fyuobot-ts.svg", title: "fyuobot-ts", linkUrl: "https://github.com/fyuo863/fyuobot-ts", description: "TypeScript 版本的模块化 Agent 框架." },
  { image: "/fyuobot-ts-tools.svg", title: "fyuobot-ts-tools", linkUrl: "https://github.com/fyuo863/fyuobot-ts-tools", description: "fyuobot-ts 使用的工具集." },
];

function Home({ user, onOpenSignIn, drawerItems }) {
  return (
    <div className="home-page">
      <PhysicsItem strength={0.75}>
        <section className="home-hero" aria-labelledby="home-title">
          <div>
            <p className="home-kicker">independent projects / notes / experiments</p>
            <h1 className="home-title" id="home-title">fyuo builds in public.</h1>
          </div>
          <div>
            <p className="home-intro">一组持续生长的工具、Agent 与技术笔记。</p>
            <span className="home-mark">scroll for selected work ↓</span>
          </div>
        </section>
      </PhysicsItem>

      <PhysicsItem strength={1.05}>
        <section className="home-feature" aria-label="Featured project">
          <FeatureCard image="/fyuobot-ts.svg" title="fyuobot-ts" githubUrl="https://github.com/fyuo863/fyuobot-ts" description="事件驱动的轻量化 Agent 框架." />
        </section>
      </PhysicsItem>

      <PhysicsItem strength={1}>
        <section className="projects-section" aria-labelledby="projects-title">
          <header className="section-head">
            <div><p className="section-kicker">selected work / 02—07</p><h2 className="section-title" id="projects-title">projects.</h2></div>
            <p className="section-note">每张卡片都通往对应的 GitHub 项目。</p>
          </header>
          <ProjectGrid projects={PROJECTS} />
        </section>
      </PhysicsItem>

      <PhysicsItem strength={0.8}><AppDrawer user={user} label="home." items={drawerItems} onOpenSignIn={onOpenSignIn} /></PhysicsItem>
    </div>
  );
}

export default Home;

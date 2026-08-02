import { useEffect, useState } from "react";
import FeatureCard from "../module/FeatureCard";
import ProjectGrid from "../module/ProjectGrid";
import AppDrawer from "../components/AppDrawer";
import HalftoneTitle from "../components/HalftoneTitle";
import PhysicsItem from "../physics/PhysicsItem";
import { getHomeContent, updateHomeContent } from "../api";

const DEFAULT_HOME_CONTENT = {
  cover_image: "/fyuobot-ts.svg",
  cover_title: "fyuobot-ts",
  cover_github_url: "https://github.com/fyuo863/fyuobot-ts",
  cover_description: "事件驱动的轻量化 Agent 框架.",
  projects: [
    { image: "/fyuo-blogs.svg", title: "fyuo-blogs.", link_url: "https://github.com/fyuo863/fyuo-blogs", description: "个人博客项目(即本网站)." },
    { image: "/go-file-fetch.svg", title: "go-file-fetch", link_url: "https://github.com/fyuo863/go-file-fetch", description: "简单的多线程文件下载器." },
    { image: "/fyuo-bot.svg", title: "fyuo-bot", link_url: "https://github.com/fyuo863/fyuo_bot", description: "一个轻量化的 Agent 框架." },
    { image: "/fyuo-ops.svg", title: "fyuo-ops", link_url: "https://github.com/fyuo863/fyuo-ops", description: "运维特化 Agent." },
    { image: "/fyuobot-ts.svg", title: "fyuobot-ts", link_url: "https://github.com/fyuo863/fyuobot-ts", description: "TypeScript 版本的模块化 Agent 框架." },
    { image: "/fyuobot-ts-tools.svg", title: "fyuobot-ts-tools", link_url: "https://github.com/fyuo863/fyuobot-ts-tools", description: "fyuobot-ts 使用的工具集." },
  ],
};

const cloneContent = (content) => ({
  ...content,
  projects: content.projects.map((project) => ({ ...project })),
});

const newProject = () => ({
  image: "/fyuo-blogs.svg",
  title: "new project",
  link_url: "",
  description: "项目简介。",
});

function Home({ user, onOpenSignIn, onNotify, drawerItems }) {
  const [content, setContent] = useState(DEFAULT_HOME_CONTENT);
  const [draft, setDraft] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getHomeContent()
      .then((response) => {
        if (!cancelled && response.data?.data) setContent(response.data.data);
      })
      .catch(() => {
        // The default content remains visible when the API is unavailable.
      });
    return () => { cancelled = true; };
  }, []);

  const startEditing = () => setDraft(cloneContent(content));
  const cancelEditing = () => setDraft(null);
  const updateDraft = (field, value) => setDraft((current) => ({ ...current, [field]: value }));
  const updateProject = (index, field, value) => {
    setDraft((current) => ({
      ...current,
      projects: current.projects.map((project, projectIndex) => (
        projectIndex === index ? { ...project, [field]: value } : project
      )),
    }));
  };
  const addProject = () => setDraft((current) => ({ ...current, projects: [...current.projects, newProject()] }));
  const removeProject = (index) => setDraft((current) => ({
    ...current,
    projects: current.projects.filter((_, projectIndex) => projectIndex !== index),
  }));

  const saveContent = async (event) => {
    event.preventDefault();
    if (!draft || !user?.token) return;
    setIsSaving(true);
    try {
      const response = await updateHomeContent(draft, user.token);
      setContent(response.data.data);
      setDraft(null);
      onNotify?.({ title: "saved.", message: "首页内容已更新。" });
    } catch (error) {
      onNotify?.({ title: "save failed.", message: error?.response?.data?.error || "首页内容暂时无法保存。" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="home-page">
      <PhysicsItem strength={0.75}>
        <section className="home-cover" aria-labelledby="home-title">
          <p className="cover-edition">fyuo / independent work / issue 01</p>
          <HalftoneTitle id="home-title"><span>PROJECTS</span><span>&amp; NOTES</span></HalftoneTitle>
          <div className="cover-deck">
            <p>一组持续生长的工具、Agent 与技术笔记。</p>
            <a className="cover-link" href="#projects">view the index ↓</a>
          </div>
        </section>
      </PhysicsItem>

      <PhysicsItem strength={1.05}>
        <section className="home-feature" aria-label="Featured project">
          {user && <div className="home-edit-bar"><p>authenticated</p><button className="home-edit-trigger" type="button" onClick={startEditing}>edit home.</button></div>}
          <FeatureCard image={content.cover_image} title={content.cover_title} githubUrl={content.cover_github_url} description={content.cover_description} />
        </section>
      </PhysicsItem>

      <PhysicsItem strength={1}>
        <section className="projects-section" id="projects" aria-labelledby="projects-title">
          <header className="section-head"><div><p className="section-kicker">the index / 02—07</p><h2 className="section-title" id="projects-title"><span className="section-title__selected">Selected work.</span></h2></div><p className="section-note">每一项都直接通往对应的 GitHub 项目。</p></header>
          <ProjectGrid projects={content.projects.map(({ link_url, ...project }) => ({ ...project, linkUrl: link_url }))} />
        </section>
      </PhysicsItem>

      {draft && (
        <section className="home-editor" aria-labelledby="home-editor-title">
          <form onSubmit={saveContent}>
            <header className="home-editor__head">
              <div><p className="section-kicker">editor / authenticated</p><h2 id="home-editor-title">Home content.</h2></div>
              <button className="home-editor__close" type="button" onClick={cancelEditing}>close ×</button>
            </header>

            <fieldset className="home-editor__fieldset">
              <legend>Cover Story</legend>
              <label>封面地址<input value={draft.cover_image} onChange={(event) => updateDraft("cover_image", event.target.value)} required /></label>
              <label>标题<input value={draft.cover_title} onChange={(event) => updateDraft("cover_title", event.target.value)} required /></label>
              <label>GitHub 链接<input value={draft.cover_github_url} onChange={(event) => updateDraft("cover_github_url", event.target.value)} /></label>
              <label>简介<textarea value={draft.cover_description} onChange={(event) => updateDraft("cover_description", event.target.value)} required /></label>
            </fieldset>

            <fieldset className="home-editor__fieldset">
              <legend>Selected Work</legend>
              <div className="home-editor__projects">
                {draft.projects.map((project, index) => (
                  <article className="home-editor__project" key={`${project.title}-${index}`}>
                    <div className="home-editor__project-head"><strong>{String(index + 1).padStart(2, "0")}</strong>{draft.projects.length > 1 && <button type="button" onClick={() => removeProject(index)}>remove</button>}</div>
                    <label>封面地址<input value={project.image} onChange={(event) => updateProject(index, "image", event.target.value)} required /></label>
                    <label>标题<input value={project.title} onChange={(event) => updateProject(index, "title", event.target.value)} required /></label>
                    <label>项目链接<input value={project.link_url} onChange={(event) => updateProject(index, "link_url", event.target.value)} /></label>
                    <label>简介<textarea value={project.description} onChange={(event) => updateProject(index, "description", event.target.value)} required /></label>
                  </article>
                ))}
              </div>
              <button className="home-editor__add" type="button" onClick={addProject}>+ add project</button>
            </fieldset>

            <footer className="home-editor__actions">
              <button type="button" onClick={cancelEditing}>cancel</button>
              <button type="submit" disabled={isSaving}>{isSaving ? "saving…" : "save changes"}</button>
            </footer>
          </form>
        </section>
      )}

      <PhysicsItem strength={0.8}><AppDrawer user={user} label="account." items={drawerItems} onOpenSignIn={onOpenSignIn} /></PhysicsItem>
    </div>
  );
}

export default Home;

import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import FeatureCard from "../module/FeatureCard";
import ProjectGrid from "../module/ProjectGrid";
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

const editorDraft = (content) => ({
  cover_github_url: content.cover_github_url,
  cover_description: content.cover_description,
  projects: content.projects.map((project) => ({
    link_url: project.link_url,
    description: project.description,
  })),
});

const newProject = () => ({
  link_url: "",
  description: "",
});

function Home({ user, onOpenSignIn, onLogout, onNotify }) {
  const location = useLocation();
  const [content, setContent] = useState(DEFAULT_HOME_CONTENT);
  const [draft, setDraft] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isContentLoading, setIsContentLoading] = useState(true);
  const editorRef = useRef(null);
  const handledDeskRequest = useRef("");

  useEffect(() => {
    let cancelled = false;
    getHomeContent()
      .then((response) => {
        if (!cancelled && response.data?.data) setContent(response.data.data);
      })
      .catch(() => {
        // The default content remains visible when the API is unavailable.
      })
      .finally(() => {
        if (!cancelled) setIsContentLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const openEditor = () => {
      if (!user?.token || isContentLoading) return;
      setDraft(editorDraft(content));
      requestAnimationFrame(() => {
        editorRef.current?.scrollIntoView({ block: "start", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      });
    };

    window.addEventListener("fyuo:edit-home", openEditor);
    return () => window.removeEventListener("fyuo:edit-home", openEditor);
  }, [content, isContentLoading, user?.token]);
  useEffect(() => {
    if (!user?.token || isContentLoading || new URLSearchParams(location.search).get("desk") !== "home" || handledDeskRequest.current === location.search) return;
    setDraft(editorDraft(content));
    handledDeskRequest.current = location.search;
  }, [content, isContentLoading, location.search, user?.token]);
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
    if (!draft) return;
    if (!user?.token) {
      onNotify?.({ title: "login-required.", message: "登录状态不可用，请重新登录后再保存。" });
      onLogout?.();
      onOpenSignIn?.();
      return;
    }
    setIsSaving(true);
    try {
      const response = await updateHomeContent(draft, user.token);
      setContent(response.data.data);
      setDraft(null);
      onNotify?.({ title: "saved.", message: "首页内容已更新。" });
    } catch (error) {
      if (error?.response?.status === 401) {
        onLogout?.();
        onOpenSignIn?.();
        onNotify?.({ title: "session-expired.", message: "登录已过期，请重新登录后再保存首页内容。" });
      } else {
        onNotify?.({ title: "save failed.", message: error?.response?.data?.error || "首页内容暂时无法保存。" });
      }
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
            <p>我的个人主页。</p>
            <a className="cover-link" href="#projects">view the index ↓</a>
          </div>
        </section>
      </PhysicsItem>

      <PhysicsItem strength={1.05}>
        <section className="home-feature" aria-label="Featured project">
          <FeatureCard image={content.cover_image} title={content.cover_title} githubUrl={content.cover_github_url} description={content.cover_description} />
        </section>
      </PhysicsItem>

      <PhysicsItem strength={1}>
        <section className="projects-section" id="projects" aria-labelledby="projects-title">
          <header className="section-head"><div><p className="section-kicker">the index / 02—07</p><h2 className="section-title" id="projects-title"><span className="section-title__selected">Selected work.</span></h2></div><p className="section-note">精选项目</p></header>
          <ProjectGrid projects={content.projects.map(({ link_url, ...project }) => ({ ...project, linkUrl: link_url }))} />
        </section>
      </PhysicsItem>

      {draft && (
        <section className="home-editor" ref={editorRef} aria-labelledby="home-editor-title" tabIndex="-1">
          <form onSubmit={saveContent}>
            <header className="home-editor__head">
              <div><p className="section-kicker">editor / authenticated</p><h2 id="home-editor-title">Home content.</h2></div>
              <button className="home-editor__close" type="button" onClick={cancelEditing}>close ×</button>
            </header>

            <fieldset className="home-editor__fieldset">
              <legend>Cover Story</legend>
              <label>GitHub 仓库链接<input type="url" value={draft.cover_github_url} onChange={(event) => updateDraft("cover_github_url", event.target.value)} placeholder="https://github.com/owner/repository" required /></label>
              <label>简介<textarea value={draft.cover_description} onChange={(event) => updateDraft("cover_description", event.target.value)} required /></label>
            </fieldset>

            <fieldset className="home-editor__fieldset">
              <legend>Selected Work</legend>
              <div className="home-editor__projects">
                {draft.projects.map((project, index) => (
                  <article className="home-editor__project" key={`${project.link_url}-${index}`}>
                    <div className="home-editor__project-head"><strong>{String(index + 1).padStart(2, "0")}</strong>{draft.projects.length > 1 && <button type="button" onClick={() => removeProject(index)}>remove</button>}</div>
                    <label>GitHub 仓库链接<input type="url" value={project.link_url} onChange={(event) => updateProject(index, "link_url", event.target.value)} placeholder="https://github.com/owner/repository" required /></label>
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
    </div>
  );
}

export default Home;

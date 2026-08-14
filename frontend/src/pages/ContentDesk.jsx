import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getHomeContent, isBackendOfflineError, listArticles, listTravelPlaces } from "../api";

const CONTENT_SECTIONS = [
  { key: "home", index: "01", label: "INDEX", title: "Home content.", note: "Cover story 与 Selected work。" },
  { key: "journal", index: "02", label: "JOURNAL", title: "Journal entries.", note: "新建、编辑与归档文章。" },
  { key: "travel", index: "03", label: "TRAVEL", title: "Travel pins.", note: "地点、图集与路线标点。" },
];

function dateLabel(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "2-digit" }).toUpperCase();
}

export default function ContentDesk({ user, onOpenSignIn }) {
  const navigate = useNavigate();
  const [home, setHome] = useState(null);
  const [articles, setArticles] = useState([]);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(Boolean(user?.token));
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.token) {
      return undefined;
    }

    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const [homeResult, articleResult, placeResult] = await Promise.all([
          getHomeContent(),
          listArticles(),
          listTravelPlaces(),
        ]);
        if (cancelled) return;
        setHome(homeResult.data?.data ?? null);
        setArticles(articleResult.data?.data ?? []);
        setPlaces(placeResult.data?.data ?? []);
      } catch (requestError) {
        if (!cancelled) {
          setError(isBackendOfflineError(requestError) ? "内容服务暂不可用，工作台会在连接恢复后刷新。" : "内容目录暂时无法读取。");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();
    return () => { cancelled = true; };
  }, [user?.token]);

  if (!user?.token) {
    return (
      <main className="content-desk content-desk--locked">
        <p className="content-desk__eyebrow">FYUO863 / CONTENT DESK</p>
        <h1>Editor access required.</h1>
        <p>登录后可统一管理首页、文章与旅行记录。</p>
        <button className="content-desk__action" type="button" onClick={onOpenSignIn}>log-in.</button>
      </main>
    );
  }

  return (
    <main className="content-desk">
      <header className="content-desk__masthead">
        <p className="content-desk__eyebrow">FYUO863 / CONTENT DESK</p>
        <h1>Make changes<br />in one place.</h1>
        <p>展示页只负责阅读；所有内容修改从这里开始。</p>
      </header>

      {error && <p className="content-desk__notice" role="status">{error}</p>}

      <section className="content-desk__index" aria-label="Content sections">
        {CONTENT_SECTIONS.map((section) => (
          <article className="content-desk__section" key={section.key}>
            <p>{section.index} / {section.label}</p>
            <div>
              <h2>{section.title}</h2>
              <span>{section.note}</span>
            </div>
            {section.key === "home" && (
              <button className="content-desk__action" type="button" onClick={() => navigate("/?desk=home")}>edit home.</button>
            )}
            {section.key === "journal" && (
              <button className="content-desk__action" type="button" onClick={() => navigate("/blog?desk=new")}>new article.</button>
            )}
            {section.key === "travel" && (
              <button className="content-desk__action" type="button" onClick={() => navigate("/travel?desk=new")}>add pin.</button>
            )}
          </article>
        ))}
      </section>

      <section className="content-desk__catalogue" aria-live="polite">
        <article>
          <header><p>INDEX / LIVE CONTENT</p><h2>{home?.cover_title || "cover story."}</h2></header>
          <p>{home?.cover_description || "正在读取首页内容。"}</p>
          <span>{loading ? "loading…" : `${home?.projects?.length ?? 0} selected projects`}</span>
        </article>

        <article>
          <header><p>JOURNAL / ENTRIES</p><h2>{loading ? "Loading…" : `${articles.length} entries.`}</h2></header>
          <ul>
            {articles.slice(0, 5).map((article) => (
              <li key={article.id}>
                <button type="button" onClick={() => navigate(`/blog?desk=edit&id=${article.id}`)}>{article.title}</button>
                <time>{dateLabel(article.created_at)}</time>
              </li>
            ))}
          </ul>
        </article>

        <article>
          <header><p>TRAVEL / PINS</p><h2>{loading ? "Loading…" : `${places.length} pins.`}</h2></header>
          <ul>
            {places.slice(0, 5).map((place) => (
              <li key={place.id}>
                <button type="button" onClick={() => navigate(`/travel?desk=edit&id=${place.id}`)}>{place.name}</button>
                <time>{Number(place.latitude).toFixed(2)}°, {Number(place.longitude).toFixed(2)}°</time>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </main>
  );
}

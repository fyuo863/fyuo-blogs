import { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import BlogPost from "../components/BlogPost";
import AppDrawer from "../components/AppDrawer";
import PhysicsItem from "../physics/PhysicsItem";
import {
  createArticle,
  updateArticle,
  listArticles,
  deleteArticle,
  searchArticles,
  recordArticleView,
  uploadArticleImage,
  isBackendOfflineError,
} from "../api";

function formatDate(iso) {
  const d = new Date(iso);
  const date = d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const time = d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return `${date} ${time}`.toUpperCase();
}

function errorMessage(err, fallback) {
  return (
    err.response?.data?.error ||
    err.response?.data?.message ||
    err.message ||
    fallback
  );
}

function isCount(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function applyCounterPatch(post, counters) {
  if (!post) return post;

  const patch = {};

  if (isCount(counters?.view_count)) {
    patch.view_count = counters.view_count;
  }

  if (isCount(counters?.like_count)) {
    patch.like_count = counters.like_count;
  }

  return Object.keys(patch).length > 0 ? { ...post, ...patch } : post;
}

function getVisitorId() {
  const key = "fyuo_visitor_id";
  const existing = localStorage.getItem(key);

  if (existing) return existing;

  const created =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `visitor-${Date.now()}`;

  localStorage.setItem(key, created);
  return created;
}

function BackendOfflineNotice() {
  return (
    <PhysicsItem strength={0.75}>
      <article className="journal-entry journal-entry--offline" role="status">
        <div className="journal-entry__meta">
          <time dateTime={new Date().toISOString()}>{formatDate(new Date().toISOString())}</time>
        </div>
        <div className="journal-entry__content">
          <h2>文章服务暂不可用。</h2>
          <div className="journal-entry__preview">
            <p>文章列表、搜索、点赞、浏览量和管理功能会在服务恢复后自动可用。页面其余内容仍然可以正常浏览。</p>
            <code className="journal-entry__system-message">API service is unavailable. Please try again shortly.</code>
          </div>
        </div>
      </article>
    </PhysicsItem>
  );
}

function Blog({ user, onOpenSignIn, onLogout, onNotify, drawerItems, showDrawer = true }) {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [backendOffline, setBackendOffline] = useState(false);

  const editRef = useRef(null);
  const searchRef = useRef(null);
  const journalTitleRef = useRef(null);
  const journalScatterRef = useRef({
    active: false,
    idleAngle: 0,
    x: 8,
    y: 0,
    targetX: 8,
    targetY: 0,
    lastTime: null,
  });

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    let animationFrame;
    const tick = (time) => {
      const scatter = journalScatterRef.current;
      const elapsed = Math.min(32, time - (scatter.lastTime ?? time));
      scatter.lastTime = time;

      if (!scatter.active) {
        scatter.idleAngle += (elapsed / 18000) * Math.PI * 2;
        scatter.targetX = Math.cos(scatter.idleAngle) * 8;
        scatter.targetY = Math.sin(scatter.idleAngle) * 8;
      }

      const blend = 1 - Math.exp(-elapsed / (scatter.active ? 90 : 180));
      scatter.x += (scatter.targetX - scatter.x) * blend;
      scatter.y += (scatter.targetY - scatter.y) * blend;
      journalTitleRef.current?.style.setProperty("--journal-scatter-x", `${scatter.x}px`);
      journalTitleRef.current?.style.setProperty("--journal-scatter-y", `${scatter.y}px`);
      animationFrame = requestAnimationFrame(tick);
    };

    animationFrame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  const fetchPosts = useCallback(() => {
    if (backendOffline) return;

    listArticles()
      .then((res) => {
        setBackendOffline(false);

        const nextPosts = res.data.data ?? [];

        setPosts(nextPosts);

      })
      .catch((err) => {
        if (isBackendOfflineError(err)) {
          setBackendOffline(true);
          setPosts([]);
          setSearchResults([]);
          setShowDropdown(false);
          return;
        }

        onNotify?.({
          variant: "error",
          title: "load-failed.",
          message: errorMessage(err, "文章列表加载失败。"),
        });
      });
  }, [backendOffline, onNotify]);

  useEffect(() => {
    if (!selectedPost) {
      fetchPosts();
    }
  }, [selectedPost, fetchPosts]);

  useEffect(() => {
    if (!selectedPost?.id || backendOffline) return;

    recordArticleView(
      selectedPost.id,
      getVisitorId(),
      `/blog/${selectedPost.id}`
    )
      .then((res) => {
        const counters = res.data ?? {};

        setPosts((prev) =>
          prev.map((p) =>
            p.id === selectedPost.id ? applyCounterPatch(p, counters) : p
          )
        );

        setSelectedPost((prev) =>
          prev?.id === selectedPost.id ? applyCounterPatch(prev, counters) : prev
        );
      })
      .catch((err) => {
        if (isBackendOfflineError(err)) {
          setBackendOffline(true);
          return;
        }

        onNotify?.({
          variant: "error",
          title: "view-sync-failed.",
          message: errorMessage(err, "浏览量同步失败。"),
        });
      });
  }, [selectedPost?.id, backendOffline, onNotify]);

  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  const handleSearch = () => {
    if (backendOffline) {
      onNotify?.({
        variant: "info",
        title: "backend-offline.",
        message: "当前未连接后端，搜索功能暂不可用。",
      });
      return;
    }

    const q = searchQuery.trim();

    if (!q) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    searchArticles(q)
      .then((res) => {
        setSearchResults(res.data.data ?? []);
        setShowDropdown(true);
      })
      .catch((err) => {
        if (isBackendOfflineError(err)) {
          setBackendOffline(true);
          setSearchResults([]);
          setShowDropdown(false);
          return;
        }

        onNotify?.({
          variant: "error",
          title: "search-failed.",
          message: errorMessage(err, "搜索失败。"),
        });
      });
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);

    if (e.target.value.trim() === "") {
      setSearchResults([]);
      setShowDropdown(false);
    }
  };

  const handleSelectResult = (post) => {
    setSearchQuery("");
    setSearchResults([]);
    setShowDropdown(false);
    setSelectedPost(post);
  };

  const isBlogView = selectedPost !== null;
  const isNewPost = selectedPost?.id == null;

  const blogItems = isNewPost
    ? [
        { label: "save,", action: "save" },
        { label: "discard,", action: "discard" },
      ]
    : isEditing
      ? [
          { label: "save,", action: "save" },
          { label: "discard,", action: "discard" },
          { label: "back,", action: "back" },
        ]
      : [
          { label: "edit,", action: "edit" },
          { label: "delete,", action: "delete" },
          { label: "back,", action: "back" },
        ];

  const currentMenu = isBlogView ? blogItems : [];

  const closePost = () => {
    setSelectedPost(null);
    setIsEditing(false);
    setSearchQuery("");
  };

  const handleProtectedError = (err, fallback) => {
    const status = err.response?.status;

    if (isBackendOfflineError(err)) {
      setBackendOffline(true);
      onNotify?.({
        variant: "info",
        title: "backend-offline.",
        message: "当前未连接后端，此操作暂不可用。",
      });
      return;
    }

    if (status === 401) {
      onLogout();
      onNotify?.({
        variant: "error",
        title: "session-expired.",
        message: errorMessage(err, "登录已过期，请重新登录。"),
      });
      onOpenSignIn();
      return;
    }

    onNotify?.({
      variant: "error",
      title: "request-failed.",
      message: errorMessage(err, fallback),
    });
  };

  const handleMenuAction = (action) => {
    if (backendOffline && ["create", "save", "delete"].includes(action)) {
      onNotify?.({
        variant: "info",
        title: "backend-offline.",
        message: "当前未连接后端，文章管理功能暂不可用。",
      });
      return;
    }

    if (action === "create") {
      setSelectedPost({
        id: null,
        title: "New Article",
        content: "",
        cover_image: "",
        stage: "published",
        vol: 1,
        tags: [],
        created_at: new Date().toISOString(),
      });
      setIsEditing(true);
    }

    if (action === "back") {
      closePost();
    }

    if (action === "edit") {
      setIsEditing(true);
    }

    if (action === "save") {
      if (!user?.token) {
        onNotify?.({
          variant: "error",
          title: "login-required.",
          message: "登录状态不可用，请重新登录后再保存。",
        });
        onLogout();
        onOpenSignIn();
        return;
      }

      const content = editRef.current?.getContent() ?? selectedPost.content;
      const title = editRef.current?.getTitle() ?? selectedPost.title;
      const coverImage =
        editRef.current?.getCoverImage?.() ?? selectedPost.cover_image ?? "";
      const tags = editRef.current?.getTags() ?? selectedPost.tags ?? [];
      const token = user.token;

      if (isNewPost) {
        createArticle(
          {
            title,
            content,
            cover_image: coverImage,
            stage: "published",
            vol: 1,
            tags,
          },
          token
        )
          .then(() => {
            closePost();
            onNotify?.({
              variant: "success",
              title: "article-created.",
              message: "文章已经创建并刷新缓存。",
            });
          })
          .catch((err) => {
            handleProtectedError(err, "创建失败。");
          });
      } else {
        updateArticle(
          selectedPost.id,
          {
            title,
            content,
            cover_image: coverImage,
            tags,
          },
          token
        )
          .then((res) => {
            setSelectedPost(res.data.data);
            setIsEditing(false);
            onNotify?.({
              variant: "success",
              title: "article-saved.",
              message: "文章已经保存。",
            });
          })
          .catch((err) => {
            handleProtectedError(err, "更新失败。");
          });
      }
    }

    if (action === "delete") {
      if (!user?.token) {
        onNotify?.({
          variant: "error",
          title: "login-required.",
          message: "登录状态不可用，请重新登录后再删除。",
        });
        onLogout();
        onOpenSignIn();
        return;
      }

      deleteArticle(selectedPost.id, user.token)
        .then(() => {
          closePost();
          onNotify?.({
            variant: "success",
            title: "article-deleted.",
            message: "文章已标记为隐藏。",
          });
        })
        .catch((err) => {
          handleProtectedError(err, "删除失败。");
        });
    }

    if (action === "discard") {
      if (isNewPost) {
        closePost();
        return;
      }

      setIsEditing(false);
    }
  };

  const blogDrawerItems = [
    ...(!isBlogView
      ? [{ label: "create.", onClick: () => handleMenuAction("create") }]
      : currentMenu.map((item) => ({
          label: item.label,
          // The editor ref is intentionally read only after this click.
          // eslint-disable-next-line react-hooks/refs
          onClick: () => handleMenuAction(item.action),
        }))),
    ...drawerItems,
  ];

  const handleUploadImage = async (file) => {
    if (backendOffline) {
      onNotify?.({
        variant: "info",
        title: "backend-offline.",
        message: "当前未连接后端，图片上传功能暂不可用。",
      });
      return "";
    }

    if (!user?.token) {
      onNotify?.({
        variant: "error",
        title: "login-required.",
        message: "请先登录后再上传图片。",
      });
      onOpenSignIn();
      return "";
    }

    try {
      const res = await uploadArticleImage(file, user.token);
      return res.data?.data?.url || "";
    } catch (err) {
      if (isBackendOfflineError(err)) {
        setBackendOffline(true);
        return "";
      }

      onNotify?.({
        variant: "error",
        title: "upload-failed.",
        message: errorMessage(err, "图片上传失败。"),
      });
      return "";
    }
  };

  return (
    <div className="blog-page">
      {showDrawer && (
        <PhysicsItem strength={0.8}>
          <AppDrawer
            user={user}
            label="blog."
            items={blogDrawerItems}
            onOpenSignIn={onOpenSignIn}
          />
        </PhysicsItem>
      )}

      <PhysicsItem strength={1}>
        <div>
          <header className="blog-hero">
            <p className="blog-eyebrow">journal / field notes</p>
            <h1
              className="blog-title blog-title--oil"
              ref={journalTitleRef}
              onPointerMove={(event) => {
                const bounds = event.currentTarget.getBoundingClientRect();
                const pointerX = (event.clientX - bounds.left) / bounds.width - 0.5;
                const pointerY = (event.clientY - bounds.top) / bounds.height - 0.5;
                const x = pointerX * 12;
                const y = pointerY * 8;
                const distance = 6 + Math.min(10, Math.hypot(x, y) * 0.9);
                const pointerLength = Math.hypot(pointerX, pointerY) || 1;
                const scatterX = (pointerX / pointerLength) * distance;
                const scatterY = (pointerY / pointerLength) * distance;
                const scatter = journalScatterRef.current;
                scatter.active = true;
                scatter.targetX = scatterX;
                scatter.targetY = scatterY;
                event.currentTarget.style.setProperty("--journal-refraction-x", `${x}px`);
                event.currentTarget.style.setProperty("--journal-refraction-y", `${y}px`);
                if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
                  event.currentTarget.style.setProperty("--journal-scatter-x", `${scatterX}px`);
                  event.currentTarget.style.setProperty("--journal-scatter-y", `${scatterY}px`);
                }
              }}
              onPointerLeave={(event) => {
                const scatter = journalScatterRef.current;
                scatter.active = false;
                scatter.idleAngle = Math.atan2(scatter.y, scatter.x);
                event.currentTarget.style.setProperty("--journal-refraction-x", "0px");
                event.currentTarget.style.setProperty("--journal-refraction-y", "0px");
              }}
            >
              <span className="blog-title__ink" data-title="The Journal.">The Journal.</span>
            </h1>
            <p className="blog-lede">技术笔记、项目记录与持续写作。</p>
          </header>
        </div>
      </PhysicsItem>

      <PhysicsItem strength={0.9}>
        <div className="blog-search-band">
          <div>
            <div className="blog-search-form">
              <div className="relative flex-1" ref={searchRef}>
                <input
                  type="text"
                  placeholder={
                    backendOffline ? "backend offline." : "search."
                  }
                  value={searchQuery}
                  disabled={backendOffline}
                  onChange={handleSearchInputChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                  onFocus={() => {
                    if (searchResults.length > 0) {
                      setShowDropdown(true);
                    }
                  }}
                  className="blog-search-input w-full px-5 disabled:cursor-not-allowed disabled:opacity-60"
                />

                {showDropdown && searchResults.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-zinc-900 border border-zinc-700 shadow-2xl z-50 max-h-80 overflow-y-auto">
                    {searchResults.map((post) => (
                      <button
                        key={post.id}
                        onClick={() => handleSelectResult(post)}
                        className="w-full text-left px-5 py-3 hover:bg-white/5 transition-colors border-b border-zinc-800 last:border-b-0"
                      >
                        <div className="text-sm font-semibold text-white truncate">
                          {post.title}
                        </div>
                        <time className="text-xs font-mono text-zinc-500 mt-0.5 block">
                          {formatDate(post.created_at)}
                        </time>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={handleSearch}
                disabled={backendOffline}
                className="blog-search-button px-7 disabled:cursor-not-allowed disabled:opacity-60"
              >
                search.
              </button>
            </div>
          </div>
        </div>
      </PhysicsItem>

      {backendOffline && <BackendOfflineNotice />}

      {!backendOffline && (
        <div className="journal-index">
          <div className="journal-index__list">
            {posts.map((post) => (
              <PhysicsItem key={post.id} strength={1}>
                <article className="journal-entry">
                  <div className="journal-entry__meta">
                    <time className="font-mono text-sm tracking-widest text-zinc-500 uppercase">
                      {formatDate(post.created_at)}
                    </time>
                  </div>

                  <div className="journal-entry__content">
                    <h2>
                      <button type="button" onClick={() => setSelectedPost(post)}>
                        {post.title}
                      </button>
                    </h2>
                    <div className="journal-entry__preview">
                      {post.cover_image ? (
                        <img className="journal-entry__thumbnail" src={post.cover_image} alt="" />
                      ) : (
                        <div className="journal-entry__excerpt prose prose-invert prose-sm line-clamp-4 [&_h1]:text-lg [&_h2]:text-base [&_h3]:text-sm">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {post.content}
                        </ReactMarkdown>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              </PhysicsItem>
            ))}
          </div>
        </div>
      )}

      <div className="h-24" />

      {selectedPost && (
        <PhysicsItem strength={1.15}>
          <BlogPost
            key={selectedPost.id ?? "new"}
            post={selectedPost}
            isEditing={isEditing}
            editRef={editRef}
            onBack={closePost}
            onUploadImage={handleUploadImage}
          />
        </PhysicsItem>
      )}
    </div>
  );
}

export default Blog;

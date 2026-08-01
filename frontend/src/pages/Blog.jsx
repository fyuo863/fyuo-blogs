import { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Heart } from "lucide-react";
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
  incrementLike,
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

function formatAuthor(post) {
  const name = post?.publisher_name?.trim() || post?.author?.name?.trim();
  if (!name) return "unknown";
  return `by ${name}`;
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

function likeStorageKey(post) {
  if (!post?.id) return "";
  return `${post.id}:${post.created_at || ""}`;
}

function BackendOfflineNotice() {
  return (
    <PhysicsItem strength={0.75}>
      <div className="px-[10%] py-10">
        <div className="border border-zinc-800 bg-white/[0.03] px-6 py-5">
          <div className="text-sm font-mono tracking-[0.25em] text-zinc-500 uppercase">
            dev-backend-offline.
          </div>

          <h2 className="mt-3 text-2xl font-bold tracking-tight text-white">
            Backend is not connected.
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400">
            当前正在进行纯前端开发，博客数据接口暂不可用。启动后端服务后，
            文章列表、搜索、点赞、浏览量和管理功能会恢复。
          </p>

          <div className="mt-5 rounded-sm bg-black/40 px-4 py-3 font-mono text-xs text-zinc-500 border border-zinc-900">
            npm run dev only starts the frontend. Start the backend separately.
          </div>
        </div>
      </div>
    </PhysicsItem>
  );
}

function Blog({ user, onOpenSignIn, onLogout, onNotify, drawerItems }) {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [backendOffline, setBackendOffline] = useState(false);

  const editRef = useRef(null);
  const searchRef = useRef(null);

  const [likedPosts, setLikedPosts] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("liked_articles") || "[]");
      return Array.isArray(saved)
        ? saved.filter((item) => typeof item === "string")
        : [];
    } catch {
      return [];
    }
  });

  const pendingLikesRef = useRef(new Set());
  const [pendingLikes, setPendingLikes] = useState([]);

  const fetchPosts = useCallback(() => {
    if (backendOffline) return;

    listArticles()
      .then((res) => {
        setBackendOffline(false);

        const nextPosts = res.data.data ?? [];

        setPosts(nextPosts);

        setLikedPosts((prev) => {
          const legacyIds = new Set(nextPosts.map((post) => String(post.id)));
          const nextLiked = prev.filter((key) => !legacyIds.has(key));

          try {
            localStorage.setItem("liked_articles", JSON.stringify(nextLiked));
          } catch {
            // localStorage can be unavailable in restricted browser modes.
          }

          return nextLiked;
        });
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
          onClick: () => handleMenuAction(item.action),
        }))),
    ...drawerItems,
  ];

  const handleLike = async (postId) => {
    if (backendOffline) {
      onNotify?.({
        variant: "info",
        title: "backend-offline.",
        message: "当前未连接后端，点赞功能暂不可用。",
      });
      return;
    }

    const currentPost =
      posts.find((post) => post.id === postId) ||
      (selectedPost?.id === postId ? selectedPost : null);

    const currentLikeKey = likeStorageKey(currentPost);

    if (pendingLikesRef.current.has(postId)) return;

    pendingLikesRef.current.add(postId);
    setPendingLikes(Array.from(pendingLikesRef.current));

    try {
      const res = await incrementLike(postId);
      const counters = res.data ?? {};

      if (typeof counters.liked !== "boolean" || !isCount(counters.like_count)) {
        throw new Error("Invalid like response");
      }

      setLikedPosts((prev) => {
        const next = counters.liked
          ? prev.includes(currentLikeKey)
            ? prev
            : currentLikeKey
              ? [...prev, currentLikeKey]
              : prev
          : prev.filter((key) => key !== currentLikeKey);

        try {
          localStorage.setItem("liked_articles", JSON.stringify(next));
        } catch {
          // localStorage can be unavailable in restricted browser modes.
        }

        return next;
      });

      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? applyCounterPatch(p, counters) : p))
      );

      setSelectedPost((prev) =>
        prev?.id === postId ? applyCounterPatch(prev, counters) : prev
      );
    } catch (err) {
      if (isBackendOfflineError(err)) {
        setBackendOffline(true);
        return;
      }

      onNotify?.({
        variant: "error",
        title: "like-failed.",
        message: errorMessage(err, "点赞操作失败。"),
      });
    } finally {
      pendingLikesRef.current.delete(postId);
      setPendingLikes(Array.from(pendingLikesRef.current));
    }
  };

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
    <div className="min-h-screen bg-black">
      <PhysicsItem strength={0.8}>
        <AppDrawer
          user={user}
          label="blog."
          items={blogDrawerItems}
          onOpenSignIn={onOpenSignIn}
        />
      </PhysicsItem>

      <PhysicsItem strength={1}>
        <div className="border-t border-b border-zinc-800">
          <header className="px-[10%] py-20">
            <h1 className="text-5xl font-extrabold tracking-tighter text-white">
              <span className="italic">Latest Updates</span>
            </h1>
            <p className="mt-6 text-lg font-bold text-white leading-relaxed">
              All the latest blogs, straight from
            </p>
            <span className="text-lg font-extrabold tracking-tight text-white">
              fyuo.
            </span>
          </header>
        </div>
      </PhysicsItem>

      <PhysicsItem strength={0.9}>
        <div className="border-t border-b border-zinc-800">
          <div className="px-[10%] py-12">
            <div className="flex flex-col gap-3 sm:flex-row">
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
                  className="w-full bg-white/5 py-3 pl-5 pr-5 text-sm text-white placeholder:text-zinc-500 border border-zinc-800 focus:border-zinc-600 focus:outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-60"
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
                className="bg-white/10 px-7 py-3 text-base font-semibold text-white hover:bg-white/20 active:bg-white/5 transition-colors shrink-0 disabled:cursor-not-allowed disabled:opacity-60"
              >
                search.
              </button>
            </div>
          </div>
        </div>
      </PhysicsItem>

      {backendOffline && <BackendOfflineNotice />}

      {!backendOffline && (
        <div className="px-[10%]">
          <div className="divide-y divide-zinc-800">
            {posts.map((post) => (
              <PhysicsItem key={post.id} strength={1}>
                <article className="py-16">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <time className="font-mono text-sm tracking-widest text-zinc-500 uppercase">
                      {formatDate(post.created_at)}
                    </time>
                    <div className="text-xs font-mono tracking-[0.28em] text-zinc-600 uppercase">
                      {formatAuthor(post)}
                    </div>
                  </div>

                  <h2 className="mt-4 text-2xl font-bold tracking-tight text-white">
                    {post.title}
                  </h2>

                  <div className="mt-4 text-zinc-400 leading-relaxed prose prose-invert prose-sm max-w-none line-clamp-4 [&_h1]:text-lg [&_h2]:text-base [&_h3]:text-sm">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {post.content}
                    </ReactMarkdown>
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <button
                      onClick={() => setSelectedPost(post)}
                      className="inline-block text-white font-semibold hover:text-zinc-300 transition-colors"
                    >
                      read-more,
                    </button>

                    <div className="flex items-center gap-4">
                      <span className="text-xs font-mono text-zinc-500">
                        {(post.view_count || 0).toLocaleString()} views
                      </span>

                      <span className="text-xs font-mono text-zinc-500">
                        {(post.like_count || 0).toLocaleString()} likes
                      </span>

                      <button
                        onClick={() => handleLike(post.id)}
                        disabled={pendingLikes.includes(post.id)}
                        className={`transition-colors ${
                          pendingLikes.includes(post.id)
                            ? "text-zinc-500 cursor-wait"
                            : likedPosts.includes(likeStorageKey(post))
                              ? "text-white"
                              : "text-zinc-600 hover:text-zinc-400"
                        }`}
                        title={
                          likedPosts.includes(likeStorageKey(post))
                            ? "取消点赞"
                            : "点赞"
                        }
                      >
                        <Heart
                          size={18}
                          fill={
                            likedPosts.includes(likeStorageKey(post))
                              ? "currentColor"
                              : "none"
                          }
                        />
                      </button>
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
import { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Heart } from "lucide-react";
import BlogPost from "../components/BlogPost";
import {
  createArticle,
  updateArticle,
  listArticles,
  deleteArticle,
  searchArticles,
  incrementView,
  incrementLike,
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

const MENU_ITEMS = [
  { label: "creat,", action: "create" },
  { label: "exit.", action: "logout" },
];

function Home({ user, onOpenSignIn, onLogout }) {
  const [posts, setPosts] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [splashPhase, setSplashPhase] = useState("visible");
  const [loaded, setLoaded] = useState(false);
  const splashStartRef = useRef(0);
  const editRef = useRef(null);
  const searchRef = useRef(null);

  const [likedPosts, setLikedPosts] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("liked_articles") || "[]");
    } catch {
      return [];
    }
  });

  // 记录 splash 开始时间
  useEffect(() => {
    if (splashStartRef.current === 0) {
      splashStartRef.current = Date.now();
    }
  }, []);

  // 首次进入 / 返回首页时拉取最新文章
  const fetchPosts = useCallback(() => {
    listArticles()
      .then((res) => setPosts(res.data.data ?? []))
      .catch((err) => console.error("获取文章列表失败", err))
      .finally(() => setLoaded(true));
  }, []);

  // 进入首页 / 从博客页返回首页时拉取文章列表
  useEffect(() => {
    if (!selectedPost) {
      fetchPosts();
      setSearchQuery("");
    }
  }, [selectedPost, fetchPosts]);

  // 点进文章详情（read-more）时上报浏览
  useEffect(() => {
    if (selectedPost?.id) {
      incrementView(selectedPost.id).then(() => {
        setPosts((prev) =>
          prev.map((p) =>
            p.id === selectedPost.id
              ? { ...p, view_count: (p.view_count || 0) + 1 }
              : p
          )
        );
      });
    }
  }, [selectedPost?.id]);

  // 文章加载完成且至少等待 3 秒后触发 splash 动画
  useEffect(() => {
    if (loaded && splashPhase === "visible") {
      const elapsed = Date.now() - splashStartRef.current;
      const remaining = Math.max(0, 3000 - elapsed);
      const timer = setTimeout(() => setSplashPhase("exiting"), remaining);
      return () => clearTimeout(timer);
    }
  }, [loaded, splashPhase]);

  // 点击外部关闭下拉栏
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = () => {
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
      .catch((err) => console.error("搜索失败", err));
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
  const currentMenu = isBlogView ? blogItems : MENU_ITEMS;

  const handleMenuAction = (action) => {
    setMenuOpen(false);
    if (action === "logout") onLogout();
    if (action === "back") {
      setSelectedPost(null);
      setIsEditing(false);
    }
    if (action === "edit") {
      setIsEditing(true);
    }
    if (action === "save") {
      const content = editRef.current?.getContent() ?? selectedPost.content;
      const title = editRef.current?.getTitle() ?? selectedPost.title;
      const tags = editRef.current?.getTags() ?? selectedPost.tags ?? [];
      const auth = { name: user?.name ?? "", password: user?.password ?? "" };
      if (isNewPost) {
        createArticle({
          ...auth,
          title,
          content,
          stage: "published",
          vol: 1,
          tags,
        })
          .then(() => {
            setSelectedPost(null);
            setIsEditing(false);
          })
          .catch((err) => console.error("创建失败", err));
      } else {
        updateArticle(selectedPost.id, { ...auth, title, content, tags })
          .then((res) => {
            setSelectedPost(res.data.data);
            setIsEditing(false);
          })
          .catch((err) => console.error("更新失败", err));
      }
    }
    if (action === "delete") {
      const auth = { name: user?.name ?? "", password: user?.password ?? "" };
      deleteArticle(selectedPost.id, auth)
        .then(() => {
          setSelectedPost(null);
          setIsEditing(false);
        })
        .catch((err) => console.error("删除失败", err));
    }
    if (action === "discard") {
      if (isNewPost) {
        setSelectedPost(null);
      }
      setIsEditing(false);
    }
    if (action === "create") {
      setSelectedPost({
        id: null,
        title: "New Article",
        content: "",
        stage: "published",
        vol: 1,
        tags: [],
        created_at: new Date().toISOString(),
      });
      setIsEditing(true);
    }
  };

  const handleLike = async (postId) => {
    const wasLiked = likedPosts.includes(postId);
    // 乐观更新
    const updated = wasLiked
      ? likedPosts.filter((id) => id !== postId)
      : [...likedPosts, postId];
    setLikedPosts(updated);
    localStorage.setItem("liked_articles", JSON.stringify(updated));
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, like_count: (p.like_count || 0) + (wasLiked ? -1 : 1) }
          : p
      )
    );
    try {
      await incrementLike(postId);
    } catch (err) {
      // 失败时回滚
      setLikedPosts(wasLiked ? [...updated, postId] : updated.filter((id) => id !== postId));
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? { ...p, like_count: (p.like_count || 0) + (wasLiked ? 1 : -1) }
            : p
        )
      );
      console.error("点赞操作失败", err);
    }
  };

  // 确定左下角触发器文案
  const triggerLabel = isNewPost ? "home." : isBlogView ? "home." : "home.";

  return (
    <div className="min-h-screen bg-black">
      {/* ── Splash 背景遮罩（加载/过渡期间显示）── */}
      {splashPhase !== "done" && (
        <div
          className={`fixed inset-0 z-[100] bg-black transition-opacity duration-[1000ms] ease-out ${
            splashPhase === "exiting"
              ? "opacity-0 pointer-events-none"
              : "opacity-100"
          }`}
          onTransitionEnd={(e) => {
            if (e.target === e.currentTarget) setSplashPhase("done");
          }}
        />
      )}

      {/* ── 标题文字（从中心动画移动至左上角，始终为同一元素）── */}
      <div
        className={`fixed z-[110] italic transition-all duration-[1000ms] ease-out ${
          splashPhase === "exiting" || splashPhase === "done"
            ? "top-0 left-0 px-4 py-4 sm:px-6 lg:px-8"
            : "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        }`}
      >
        <span
          className={`font-bold tracking-tight text-white select-none transition-all duration-[1000ms] ease-out ${
            splashPhase === "exiting" || splashPhase === "done"
              ? "text-lg"
              : "text-7xl"
          }`}
        >
          {"fyuo-blogs.".split("").map((char, i) => (
            <span
              key={i}
              className={
                splashPhase === "visible"
                  ? "inline-block animate-bounce"
                  : "inline-block"
              }
              style={
                splashPhase === "visible"
                  ? {
                      animationDelay: `${i * 0.07}s`,
                      transform: "translateY(-25%)",
                    }
                  : {}
              }
            >
              {char}
            </span>
          ))}
        </span>
      </div>

      {/* ── 首页左下角菜单 ── */}
      <div className="fixed bottom-0 left-0 z-[60] px-4 py-4 sm:px-6 lg:px-8">
        {user ? (
          <div className="flex flex-col items-start">
            {/* Slide-up menu */}
            <div
              className={`flex flex-col items-start overflow-hidden transition-all duration-300 ease-out ${
                menuOpen ? "max-h-60 opacity-100 mb-2" : "max-h-0 opacity-0"
              }`}
            >
              {currentMenu.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleMenuAction(item.action)}
                  className="text-lg font-bold tracking-tight text-zinc-500 hover:text-white transition-colors py-0.5"
                >
                  {item.label}
                </button>
              ))}
            </div>
            {/* Trigger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-lg font-bold tracking-tight text-white hover:text-zinc-300 transition-colors"
            >
              {triggerLabel}
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

      {/* ── 头部区域 ── */}
      <div className="relative w-full h-72 sm:h-80 md:h-96 border-t border-b border-zinc-800 group flex items-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"
          alt="Blog Cover"
          className="absolute inset-0 w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 z-0"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-700 z-0"></div>
        <header className="relative z-10 px-[20%] w-full">
          <h1 className="text-5xl font-extrabold tracking-tighter text-white drop-shadow-xl">
            Latest Updates
          </h1>
          <p className="mt-6 text-lg font-bold text-white leading-relaxed drop-shadow-md">
            All the latest blogs, straight from
          </p>
          <span className="text-lg font-extrabold tracking-tight text-white drop-shadow-md">
            fyuo.
          </span>
        </header>
      </div>

      {/* ── 搜索栏 ── */}
      <div className="border-t border-b border-zinc-800">
        <div className="px-[20%] py-12">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1" ref={searchRef}>
              <input
                type="text"
                placeholder="serch,"
                value={searchQuery}
                onChange={handleSearchInputChange}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                onFocus={() => {
                  if (searchResults.length > 0) setShowDropdown(true);
                }}
                className="w-full bg-white/5 py-3 pl-5 pr-5 text-sm text-white placeholder:text-zinc-500 border border-zinc-800 focus:border-zinc-600 focus:outline-none transition-colors"
              />

              {/* 搜索结果下拉栏 */}
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
              className="bg-white/10 px-7 py-3 text-base font-semibold text-white hover:bg-white/20 active:bg-white/5 transition-colors shrink-0"
            >
              search.
            </button>
          </div>
        </div>
      </div>

      {/* ── 博客展示页 ── */}
      <div className="px-[20%]">
        <div className="divide-y divide-zinc-800">
          {posts.map((post) => (
            <article key={post.id} className="py-16">
              <time className="font-mono text-sm tracking-widest text-zinc-500 uppercase">
                {formatDate(post.created_at)}
              </time>
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
                    className={`transition-colors ${
                      likedPosts.includes(post.id)
                        ? "text-white"
                        : "text-zinc-600 hover:text-zinc-400"
                    }`}
                    title={likedPosts.includes(post.id) ? "取消点赞" : "点赞"}
                  >
                    <Heart
                      size={18}
                      fill={likedPosts.includes(post.id) ? "currentColor" : "none"}
                    />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* ── 底部留白 ── */}
      <div className="h-24" />

      {selectedPost && (
        <BlogPost
          key={selectedPost.id ?? "new"}
          post={selectedPost}
          isEditing={isEditing}
          editRef={editRef}
          onBack={() => {
            setSelectedPost(null);
            setIsEditing(false);
          }}
        />
      )}
    </div>
  );
}

export default Home;

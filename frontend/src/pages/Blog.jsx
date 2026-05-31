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

function Blog({ user, onOpenSignIn, onLogout }) {
  const [posts, setPosts] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const editRef = useRef(null);
  const searchRef = useRef(null);

  const [likedPosts, setLikedPosts] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("liked_articles") || "[]");
    } catch {
      return [];
    }
  });

  const fetchPosts = useCallback(() => {
    listArticles()
      .then((res) => setPosts(res.data.data ?? []))
      .catch((err) => console.error("获取文章列表失败", err));
  }, []);

  useEffect(() => {
    if (!selectedPost) {
      fetchPosts();
      setSearchQuery("");
    }
  }, [selectedPost, fetchPosts]);

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
  const currentMenu = isBlogView ? blogItems : [];

  const handleMenuAction = (action) => {
    setMenuOpen(false);
    if (action === "logout") onLogout();
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
  };

  const handleLike = async (postId) => {
    const wasLiked = likedPosts.includes(postId);
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

  return (
    <div className="min-h-screen bg-black">
      {/* 左下角菜单 */}
      <div className="fixed bottom-0 left-0 z-[60] px-4 py-4 sm:px-6 lg:px-8">
        {user ? (
          <div className="flex flex-col items-start">
            <div
              className={`flex flex-col items-start overflow-hidden transition-all duration-300 ease-out ${
                menuOpen ? "max-h-60 opacity-100 mb-2" : "max-h-0 opacity-0"
              }`}
            >
              {isBlogView && (
                <button
                  onClick={() => handleMenuAction("create")}
                  className="text-lg font-bold tracking-tight text-zinc-500 hover:text-white transition-colors py-0.5"
                >
                  creat,
                </button>
              )}
              {currentMenu.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleMenuAction(item.action)}
                  className="text-lg font-bold tracking-tight text-zinc-500 hover:text-white transition-colors py-0.5"
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onLogout();
                }}
                className="text-lg font-bold tracking-tight text-zinc-500 hover:text-white transition-colors py-0.5"
              >
                exit.
              </button>
            </div>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-lg font-bold tracking-tight text-white hover:text-zinc-300 transition-colors"
            >
              blog.
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

      {/* 头部区域 */}
      <div className="relative w-full h-72 sm:h-80 md:h-96 border-t border-b border-zinc-800 group flex items-center overflow-hidden">
        <img
          src="/fyuo-blogs.svg"
          alt="Blog Cover"
          className="absolute inset-0 w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 z-0"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-700 z-0"></div>
        <header className="relative z-10 px-[10%] w-full">
          <h1 className="text-5xl font-extrabold tracking-tighter text-white drop-shadow-xl">
            <span className="italic">Latest Updates</span>
          </h1>
          <p className="mt-6 text-lg font-bold text-white leading-relaxed drop-shadow-md">
            All the latest blogs, straight from
          </p>
          <span className="text-lg font-extrabold tracking-tight text-white drop-shadow-md">
            fyuo.
          </span>
        </header>
      </div>

      {/* 搜索栏 */}
      <div className="border-t border-b border-zinc-800">
        <div className="px-[10%] py-12">
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

      {/* 博客列表 */}
      <div className="px-[10%]">
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

export default Blog;

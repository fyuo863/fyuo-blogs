import { useState, useRef, useEffect, useCallback } from "react";
import BlogPost from "../components/BlogPost";
import { createArticle, updateArticle, listArticles, deleteArticle } from "../api";

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
  const editRef = useRef(null);

  // 首次进入 / 返回首页时拉取最新文章
  const fetchPosts = useCallback(() => {
    listArticles()
      .then((res) => setPosts(res.data.data ?? []))
      .catch((err) => console.error("获取文章列表失败", err));
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // 从博客页返回首页时也刷新列表
  useEffect(() => {
    if (!selectedPost) fetchPosts();
  }, [selectedPost, fetchPosts]);

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
        createArticle({ ...auth, title, content, stage: "published", vol: 1, tags })
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

  // 确定左下角触发器文案
  const triggerLabel = isNewPost ? "home." : isBlogView ? "home." : "home.";

  return (
    <div className="min-h-screen bg-black">
      {/* ── 首页左上角标题 ── */}
      <div className="fixed top-0 left-0 z-[60] px-4 py-4 sm:px-6 lg:px-8">
        <span className="text-lg font-bold tracking-tight text-white italic">
          fyuo-blogs.
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
            <div className="relative flex-1">
              <input
                type="email"
                placeholder="serch,"
                className="w-full bg-white/5 py-3 pl-5 pr-5 text-sm text-white placeholder:text-zinc-500 border border-zinc-800 focus:border-zinc-600 focus:outline-none transition-colors"
              />
            </div>
            <button className="bg-white/10 px-7 py-3 text-base font-semibold text-white hover:bg-white/20 active:bg-white/5 transition-colors shrink-0">
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
              <p className="mt-4 text-zinc-400 leading-relaxed">
                {post.content.slice(0, 200)}...
              </p>
              <button
                onClick={() => setSelectedPost(post)}
                className="mt-6 inline-block text-white font-semibold hover:text-zinc-300 transition-colors"
              >
                read-more,
              </button>
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

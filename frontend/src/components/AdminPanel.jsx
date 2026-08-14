import { useCallback, useEffect, useState } from "react";
import { ChevronRight, Eye, KeyRound, Shield, X } from "lucide-react";
import {
  createApiKey,
  deleteApiKey,
  listApiKeys,
  listPublisherUsers,
  listVisitRecords,
  rotateApiKey,
  updateApiKey,
} from "../api";

const NAV_ITEMS = [
  {
    key: "visits",
    label: "visitor-records.",
    icon: Eye,
    title: "visitor records.",
    description: "记录时间、文章、访客、IP 与城市。",
  },
  {
    key: "mcp-keys",
    label: "mcp-dispatch.",
    icon: KeyRound,
    title: "mcp distribution.",
    description: "管理 Agent 的 API Key，并绑定到指定发布账号。",
  },
];

function formatDateTime(value) {
  if (!value) return "-";
  return new Date(value).toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function VisitRecordPage({ open, token, onNotify, active }) {
  const [records, setRecords] = useState([]);
  const [sort, setSort] = useState("latest");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !token || !active) return;
    let cancelled = false;
    const timer = window.setTimeout(() => {
      setLoading(true);
      listVisitRecords(token, { sort })
        .then((res) => {
          if (!cancelled) setRecords(res.data?.data ?? []);
        })
        .catch((err) => {
          if (!cancelled) {
            onNotify?.({
              variant: "error",
              title: "visit-load-failed.",
              message: err.response?.data?.error || err.response?.data?.message || err.message || "访客记录加载失败。",
            });
          }
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [open, token, sort, onNotify, active]);

  if (!active) return null;

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-zinc-800 px-8 py-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h3 className="text-2xl font-bold tracking-tight text-white">
              visitor records.
            </h3>
            <p className="mt-2 text-sm text-zinc-400">
              只记录访问时间、文章名、文章 ID、访客、访客 IP 与对应城市。
            </p>
          </div>
          <label className="flex flex-col gap-1 text-xs uppercase tracking-[0.3em] text-zinc-500">
            sort
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="min-w-40 border border-zinc-800 bg-black px-3 py-2 text-sm text-white focus:border-zinc-600 focus:outline-none"
            >
              <option value="latest">latest</option>
              <option value="oldest">oldest</option>
            </select>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 px-8 py-6 md:grid-cols-2">
        <div className="border border-zinc-800 bg-white/[0.03] p-5">
          <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">
            total records
          </div>
          <div className="mt-3 text-3xl font-bold text-white">{records.length}</div>
        </div>
        <div className="border border-zinc-800 bg-white/[0.03] p-5">
          <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">
            active sort
          </div>
          <div className="mt-3 text-3xl font-bold text-white">{sort}</div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-8 pb-8">
        <div className="overflow-hidden border border-zinc-800 bg-black/60">
          <table className="min-w-full divide-y divide-zinc-800 text-left">
            <thead className="bg-white/[0.03]">
              <tr className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                <th className="px-5 py-4 font-medium">time</th>
                <th className="px-5 py-4 font-medium">article</th>
                <th className="px-5 py-4 font-medium">article id</th>
                <th className="px-5 py-4 font-medium">ip</th>
                <th className="px-5 py-4 font-medium">city</th>
                <th className="px-5 py-4 font-medium">visitor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {loading ? (
                <tr>
                  <td className="px-5 py-6 text-sm text-zinc-500" colSpan={6}>
                    loading...
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td className="px-5 py-6 text-sm text-zinc-500" colSpan={6}>
                    no records.
                  </td>
                </tr>
              ) : (
                records.map((record) => (
                  <tr key={record.id} className="text-sm text-zinc-300">
                    <td className="px-5 py-4 font-mono text-xs text-zinc-500">
                      {formatDateTime(record.created_at)}
                    </td>
                    <td className="px-5 py-4 text-white">{record.content_title}</td>
                    <td className="px-5 py-4 font-mono text-xs text-zinc-500">
                      {record.article_id}
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-zinc-500">
                      {record.ip_address}
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-zinc-500">
                      {record.city}
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-zinc-500">
                      {record.visitor_id}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ApiKeyPage({ open, token, onNotify, active }) {
  const [keys, setKeys] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: "", user_id: "" });
  const [freshKey, setFreshKey] = useState("");

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [keyRes, userRes] = await Promise.all([
        listApiKeys(token),
        listPublisherUsers(token),
      ]);
      setKeys(keyRes.data?.data ?? []);
      setUsers(userRes.data?.data ?? []);
    } catch (err) {
      onNotify?.({
        variant: "error",
        title: "apikey-load-failed.",
        message:
          err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          "API Key 数据加载失败。",
      });
    } finally {
      setLoading(false);
    }
  }, [token, onNotify]);

  useEffect(() => {
    if (!open || !token || !active) return;
    const timer = window.setTimeout(() => {
      void load();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [open, token, active, load]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.user_id) {
      onNotify?.({
        variant: "error",
        title: "apikey-invalid.",
        message: "请填写 Key 名称并选择绑定账号。",
      });
      return;
    }
    setCreating(true);
    try {
      const res = await createApiKey(token, {
        name: form.name.trim(),
        user_id: Number(form.user_id),
      });
      setFreshKey(res.data?.data?.key || "");
      setForm({ name: "", user_id: "" });
      await load();
      onNotify?.({
        variant: "success",
        title: "apikey-created.",
        message: "API Key 已创建，只展示这一次。",
      });
    } catch (err) {
      onNotify?.({
        variant: "error",
        title: "apikey-create-failed.",
        message:
          err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          "创建 API Key 失败。",
      });
    } finally {
      setCreating(false);
    }
  };

  const handleToggle = async (item) => {
    try {
      await updateApiKey(token, item.id, { enabled: !item.enabled });
      await load();
    } catch (err) {
      onNotify?.({
        variant: "error",
        title: "apikey-update-failed.",
        message:
          err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          "更新 API Key 失败。",
      });
    }
  };

  const handleRotate = async (id) => {
    try {
      const res = await rotateApiKey(token, id);
      setFreshKey(res.data?.data?.key || "");
      await load();
      onNotify?.({
        variant: "success",
        title: "apikey-rotated.",
        message: "API Key 已轮换，旧 Key 已失效。",
      });
    } catch (err) {
      onNotify?.({
        variant: "error",
        title: "apikey-rotate-failed.",
        message:
          err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          "轮换 API Key 失败。",
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteApiKey(token, id);
      await load();
    } catch (err) {
      onNotify?.({
        variant: "error",
        title: "apikey-delete-failed.",
        message:
          err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          "删除 API Key 失败。",
      });
    }
  };

  if (!active) return null;

  return (
    <div className="flex h-full flex-col">
      <div className="grid grid-cols-1 gap-6 border-b border-zinc-800 px-8 py-6 xl:grid-cols-[420px_minmax(0,1fr)]">
        <form onSubmit={handleCreate} className="border border-zinc-800 bg-white/[0.03] p-5">
          <div className="flex items-center gap-3 text-white">
            <Shield size={16} />
            <div className="text-sm font-semibold">create api key.</div>
          </div>
          <div className="mt-5 space-y-4">
            <input
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="agent-main"
              className="w-full border border-zinc-800 bg-black px-3 py-3 text-sm text-white focus:border-zinc-600 focus:outline-none"
            />
            <select
              value={form.user_id}
              onChange={(e) => setForm((prev) => ({ ...prev, user_id: e.target.value }))}
              className="w-full border border-zinc-800 bg-black px-3 py-3 text-sm text-white focus:border-zinc-600 focus:outline-none"
            >
              <option value="">select publisher account</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} / {user.role}
                </option>
              ))}
            </select>
            <button
              type="submit"
              disabled={creating}
              className="w-full border border-white bg-white px-4 py-3 text-sm font-semibold text-black transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
            >
              {creating ? "creating..." : "create key"}
            </button>
          </div>
        </form>

        <div className="border border-zinc-800 bg-black/50 p-5">
          <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">
            one-time secret
          </div>
          <div className="mt-3 break-all border border-zinc-800 bg-zinc-950 px-4 py-4 font-mono text-sm text-emerald-300">
            {freshKey || "创建或轮换后，这里会显示一次明文 API Key。"}
          </div>
          <p className="mt-3 text-sm text-zinc-500">
            MCP 侧只需要配置这个 Key。后端会根据 Key 自动映射到绑定账号。
          </p>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-8 py-6">
        <div className="overflow-hidden border border-zinc-800 bg-black/60">
          <table className="min-w-full divide-y divide-zinc-800 text-left">
            <thead className="bg-white/[0.03]">
              <tr className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                <th className="px-5 py-4 font-medium">name</th>
                <th className="px-5 py-4 font-medium">bound user</th>
                <th className="px-5 py-4 font-medium">status</th>
                <th className="px-5 py-4 font-medium">last used</th>
                <th className="px-5 py-4 font-medium">created</th>
                <th className="px-5 py-4 font-medium">actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {loading ? (
                <tr>
                  <td className="px-5 py-6 text-sm text-zinc-500" colSpan={6}>
                    loading...
                  </td>
                </tr>
              ) : keys.length === 0 ? (
                <tr>
                  <td className="px-5 py-6 text-sm text-zinc-500" colSpan={6}>
                    no api keys.
                  </td>
                </tr>
              ) : (
                keys.map((item) => (
                  <tr key={item.id} className="text-sm text-zinc-300">
                    <td className="px-5 py-4 text-white">{item.name}</td>
                    <td className="px-5 py-4">
                      <div className="text-white">{item.user_name}</div>
                      <div className="mt-1 text-xs uppercase tracking-[0.2em] text-zinc-500">
                        {item.user_role}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleToggle(item)}
                        className={`border px-3 py-2 text-xs uppercase tracking-[0.2em] ${
                          item.enabled
                            ? "border-emerald-700 text-emerald-300"
                            : "border-zinc-700 text-zinc-500"
                        }`}
                      >
                        {item.enabled ? "enabled" : "disabled"}
                      </button>
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-zinc-500">
                      {formatDateTime(item.last_used_at)}
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-zinc-500">
                      {formatDateTime(item.created_at)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleRotate(item.id)}
                          className="border border-zinc-700 px-3 py-2 text-xs text-white"
                        >
                          rotate
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="border border-red-900 px-3 py-2 text-xs text-red-300"
                        >
                          delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AdminPanel({ open, onClose, user, onNotify }) {
  const [activeKey, setActiveKey] = useState("visits");

  if (!open) return null;

  const activeItem = NAV_ITEMS.find((item) => item.key === activeKey) ?? NAV_ITEMS[0];

  return (
    <div className="admin-panel" role="dialog" aria-modal="true" aria-label="Admin control panel">
      <div className="admin-panel__surface">
        <button
          onClick={onClose}
          className="admin-panel__close"
          aria-label="Close admin panel"
        >
          <X size={18} />
        </button>

        <aside className="admin-panel__rail">
          <div>
            <div className="flex items-center gap-3 text-white">
              <div className="flex h-11 w-11 items-center justify-center border border-zinc-700 bg-white/5">
                <Shield size={20} />
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.35em] text-zinc-500">
                  admin center
                </div>
                <div className="mt-1 text-2xl font-bold tracking-tight">
                  fyuo-control.
                </div>
              </div>
            </div>

            <div className="admin-panel__nav-list">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = item.key === activeKey;
                return (
                  <button
                    key={item.key}
                    onClick={() => setActiveKey(item.key)}
                    className={`admin-panel__nav-item${active ? " is-active" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={16} />
                      <span className="text-sm font-semibold tracking-tight">
                        {item.label}
                      </span>
                    </div>
                    <ChevronRight size={16} />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="admin-panel__identity">
            <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">
              signed in
            </div>
            <div className="mt-3 text-lg font-semibold text-white">
              {user?.name || "unknown"}
            </div>
            <div className="mt-1 text-sm text-zinc-500">{user?.role || "-"}</div>
          </div>
        </aside>

        <div className="admin-panel__content">
          <div className="admin-panel__mobile-nav">
            <div className="text-xs uppercase tracking-[0.35em] text-zinc-500">
              admin center
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setActiveKey(item.key)}
                  className={`admin-panel__mobile-nav-item${item.key === activeKey ? " is-active" : ""}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="admin-panel__heading">
            <div className="text-xs uppercase tracking-[0.35em] text-zinc-500">
              {activeItem.description}
            </div>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-white">
              {activeItem.title}
            </h2>
          </div>

          <VisitRecordPage
            open={open}
            token={user?.token}
            onNotify={onNotify}
            active={activeKey === "visits"}
          />
          <ApiKeyPage
            open={open}
            token={user?.token}
            onNotify={onNotify}
            active={activeKey === "mcp-keys"}
          />
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;

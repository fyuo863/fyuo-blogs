import { useEffect, useState } from "react";
import { ChevronRight, Database, Eye, X } from "lucide-react";
import { listVisitRecords } from "../api";

const NAV_ITEMS = [
  {
    key: "visits",
    label: "visitor-records.",
    icon: Eye,
    title: "visitor records.",
    description: "记录时间、文章、访客、IP 与城市。",
  },
];

function formatDateTime(value) {
  return new Date(value).toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function VisitRecordPage({ open, token, onNotify }) {
  const [records, setRecords] = useState([]);
  const [sort, setSort] = useState("latest");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !token) return;
    setLoading(true);
    listVisitRecords(token, { sort })
      .then((res) => setRecords(res.data?.data ?? []))
      .catch((err) => {
        onNotify?.({
          variant: "error",
          title: "visit-load-failed.",
          message:
            err.response?.data?.error ||
            err.response?.data?.message ||
            err.message ||
            "访客记录加载失败。",
        });
      })
      .finally(() => setLoading(false));
  }, [open, token, sort, onNotify]);

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

function AdminPanel({ open, onClose, user, onNotify }) {
  const [activeKey, setActiveKey] = useState("visits");

  if (!open) return null;

  const activeItem = NAV_ITEMS.find((item) => item.key === activeKey) ?? NAV_ITEMS[0];

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/75 px-4 py-8 backdrop-blur-sm">
      <div className="relative flex h-[min(82vh,920px)] w-full max-w-7xl overflow-hidden border border-zinc-800 bg-zinc-950 shadow-2xl shadow-black/60">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center border border-zinc-800 bg-black/60 text-zinc-400 transition-colors hover:text-white"
        >
          <X size={18} />
        </button>

        <div className="hidden w-[320px] flex-col justify-between border-r border-zinc-800 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_50%),linear-gradient(180deg,_rgba(255,255,255,0.04),_rgba(255,255,255,0.01))] p-8 lg:flex">
          <div>
            <div className="flex items-center gap-3 text-white">
              <div className="flex h-11 w-11 items-center justify-center border border-zinc-700 bg-white/5">
                <Database size={20} />
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

            <div className="mt-10 space-y-3">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = item.key === activeKey;
                return (
                  <button
                    key={item.key}
                    onClick={() => setActiveKey(item.key)}
                    className={`group flex w-full items-center justify-between border px-4 py-4 text-left transition-all ${
                      active
                        ? "border-white bg-white text-black"
                        : "border-zinc-800 bg-black/30 text-zinc-300 hover:border-zinc-600 hover:text-white"
                    }`}
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

          <div className="border-t border-zinc-800 pt-6">
            <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">
              signed in
            </div>
            <div className="mt-3 text-lg font-semibold text-white">
              {user?.name || "unknown"}
            </div>
            <div className="mt-1 text-sm text-zinc-500">{user?.role || "-"}</div>
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="border-b border-zinc-800 bg-black/40 px-6 py-5 lg:hidden">
            <div className="text-xs uppercase tracking-[0.35em] text-zinc-500">
              admin center
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setActiveKey(item.key)}
                  className={`border px-3 py-2 text-sm ${
                    item.key === activeKey
                      ? "border-white bg-white text-black"
                      : "border-zinc-800 text-zinc-300"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="border-b border-zinc-800 px-8 py-6">
            <div className="text-xs uppercase tracking-[0.35em] text-zinc-500">
              {activeItem.description}
            </div>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-white">
              {activeItem.title}
            </h2>
          </div>

          <VisitRecordPage open={open} token={user?.token} onNotify={onNotify} />
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;

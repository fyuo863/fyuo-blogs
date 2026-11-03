import { useEffect, useState } from 'react';
import { listVisitRecords } from '../api';
import './visit-records.css';

const emptyFilters = { search: '', article_id: '', from: '', through: '' };
const initialQuery = { page: 1, page_size: 25, sort: 'latest' };
const formatTime = value => value ? new Date(value).toLocaleString('zh-CN', { hour12: false }) : '—';
const cityLabel = city => ({ unknown: '未识别', 'local network': '内网地址' })[city] || city || '未识别';

function filterParams(filters) {
  const params = {};
  if (filters.search.trim()) params.search = filters.search.trim();
  if (filters.article_id) params.article_id = filters.article_id;
  if (filters.from) params.from = new Date(`${filters.from}T00:00:00`).toISOString();
  if (filters.through) {
    const until = new Date(`${filters.through}T00:00:00`);
    until.setDate(until.getDate() + 1);
    params.until = until.toISOString();
  }
  return params;
}

export default function VisitRecords({ open, token, active }) {
  const [filters, setFilters] = useState(emptyFilters);
  const [query, setQuery] = useState(initialQuery);
  const [revision, setRevision] = useState(0);
  const [result, setResult] = useState({ key: '', data: null, error: '' });
  const [formError, setFormError] = useState('');
  const key = JSON.stringify([token, query, revision]);
  const loading = result.key !== key;
  const data = !loading && !result.error ? result.data : null;
  const records = data?.data ?? [];
  const page = data?.page ?? query.page;
  const totalPages = data?.total_pages ?? 0;

  useEffect(() => {
    if (!open || !token || !active) return;
    let cancelled = false;
    listVisitRecords(token, query).then(response => {
      if (!cancelled) setResult({ key, data: response.data, error: '' });
    }).catch(error => {
      if (!cancelled) setResult({ key, data: null, error: error.response?.data?.error || '访问记录加载失败，请重试。' });
    });
    return () => { cancelled = true; };
  }, [open, token, active, query, key]);

  if (!active) return null;

  function applyFilters(event) {
    event.preventDefault();
    if (filters.from && filters.through && filters.from > filters.through) {
      setFormError('结束日期不能早于开始日期。');
      return;
    }
    setFormError('');
    setQuery(current => ({ ...initialQuery, page_size: current.page_size, sort: current.sort, ...filterParams(filters) }));
    setRevision(value => value + 1);
  }

  function resetFilters() {
    setFilters(emptyFilters);
    setFormError('');
    setQuery(current => ({ ...initialQuery, page_size: current.page_size, sort: current.sort }));
    setRevision(value => value + 1);
  }

  const field = name => ({ value: filters[name], onChange: event => setFilters(current => ({ ...current, [name]: event.target.value })) });

  return (
    <section className="admin-panel__page visit-records" aria-label="文章访问记录" aria-busy={loading}>
      <p className="visit-records__scope">仅统计文章打开记录。浏览器标识用于区分浏览器，不代表实际人数。</p>
      <form className="visit-records__filters" onSubmit={applyFilters}>
        <label className="visit-records__search">搜索<input type="search" maxLength={120} placeholder="文章标题、IP 或浏览器标识" {...field('search')} /></label>
        <label>文章 ID<input inputMode="numeric" pattern="[1-9][0-9]{0,9}" placeholder="全部文章" {...field('article_id')} /></label>
        <label>开始日期<input type="date" {...field('from')} /></label>
        <label>结束日期<input type="date" {...field('through')} /></label>
        <div className="visit-records__actions"><button type="submit">应用筛选</button><button type="button" onClick={resetFilters}>重置</button></div>
        {formError && <p role="alert">{formError}</p>}
      </form>

      <dl className="visit-records__stats" aria-label="筛选结果统计">
        <div><dt>访问记录</dt><dd>{data?.total ?? '—'}</dd></div>
        <div><dt>浏览器标识</dt><dd>{data?.browser_count ?? '—'}</dd></div>
        <div><dt>访问文章</dt><dd>{data?.article_count ?? '—'}</dd></div>
      </dl>

      <div className="visit-records__toolbar">
        <label>时间排序<select value={query.sort} onChange={event => setQuery(current => ({ ...current, sort: event.target.value, page: 1 }))}><option value="latest">最新在前</option><option value="oldest">最早在前</option></select></label>
        <label>每页条数<select value={query.page_size} onChange={event => setQuery(current => ({ ...current, page_size: Number(event.target.value), page: 1 }))}>{[25, 50, 100].map(size => <option key={size} value={size}>{size} 条</option>)}</select></label>
        <button type="button" disabled={loading} onClick={() => setRevision(value => value + 1)}>刷新记录</button>
      </div>

      {!loading && result.error ? <div className="visit-records__error" role="alert"><p>{result.error}</p><button onClick={() => setRevision(value => value + 1)}>重新加载</button></div> : <>
        <p className="visit-records__status" role="status">{loading ? '正在加载访问记录…' : data?.total ? `共 ${data.total} 条，当前显示 ${(page - 1) * (data.page_size ?? query.page_size) + 1}–${(page - 1) * (data.page_size ?? query.page_size) + records.length} 条` : '没有符合条件的访问记录。'}</p>
        {!loading && records.length > 0 && <div className="visit-records__table" role="region" aria-label="访问明细，可横向滚动" tabIndex={0}>
          <table><thead><tr><th scope="col">访问时间</th><th scope="col">文章</th><th scope="col">IP / 城市</th><th scope="col">浏览器标识</th></tr></thead>
            <tbody>{records.map(record => <tr key={record.id}>
              <td><time dateTime={record.created_at}>{formatTime(record.created_at)}</time></td>
              <td><strong>{record.content_title || '未命名文章'}</strong><span>文章 ID：{record.article_id ?? '—'}</span></td>
              <td><code>{record.ip_address || '—'}</code><span>{cityLabel(record.city)}</span></td>
              <td><code>{record.visitor_id || '—'}</code></td>
            </tr>)}</tbody>
          </table>
        </div>}
      </>}
      <nav className="visit-records__pagination" aria-label="访问记录分页">
        <button disabled={loading || !data || page <= 1} onClick={() => setQuery(current => ({ ...current, page: page - 1 }))}>上一页</button>
        <span>第 {totalPages ? page : 0} / {totalPages} 页</span>
        <button disabled={loading || !data || page >= totalPages} onClick={() => setQuery(current => ({ ...current, page: page + 1 }))}>下一页</button>
      </nav>
    </section>
  );
}

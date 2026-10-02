import { useEffect, useState } from 'react';
import config from './config.json';
import './style.css';

const number = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 });
const fmt = value => value == null ? '—' : number.format(value);
const validNumber = value => typeof value === 'number' && Number.isFinite(value) && value >= 0;
function validate(raw) {
  const data = raw.data ?? raw;
  if (data.schemaVersion !== 1 || !Number.isFinite(Date.parse(data.updatedAt)) || !['today', 'month', 'allTime'].every(key => validNumber(data.totals?.[key]))) throw new Error('数据格式不兼容');
  for (const key of ['daily', 'tools', 'models']) {
    if (!Array.isArray(data[key]) || data[key].length > 2000 || !data[key].every(row => validNumber(row.tokens) && (key === 'daily' ? /^\d{4}-\d{2}-\d{2}$/.test(row.date) : typeof row.name === 'string'))) throw new Error('数据格式不兼容');
  }
  return data;
}
function Ranking({ title, rows = [] }) {
  const total = rows.reduce((sum, row) => sum + row.tokens, 0);
  return <section className="aic-ranking"><h3>{title}</h3>{!rows.length ? <p className="aic-muted">等待用量记录</p> : [...rows].sort((a, b) => b.tokens - a.tokens).slice(0, 6).map((row, i) => <div className="aic-rank" key={`${row.name}-${i}`}><div><span>{row.name}</span><strong>{fmt(row.tokens)}</strong></div><div className="aic-track"><span style={{ width: `${total ? row.tokens / total * 100 : 0}%` }} /></div></div>)}</section>;
}
export default function AICoding() {
  const [data, setData] = useState(null);
  const [state, setState] = useState('loading');
  const [period, setPeriod] = useState(30);
  const [refresh, setRefresh] = useState(0);
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    let active = true;
    let timer;
    let controller;
    async function poll() {
      controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 12000);
      try {
        const response = await fetch(config.endpoint, { signal: controller.signal, cache: 'no-store', credentials: 'omit' });
        if (!response.ok) throw new Error('unavailable');
        const next = validate(await response.json());
        if (active) { setData(next); setState('ready'); }
      } catch { if (active) setState('offline'); }
      finally {
        clearTimeout(timeout);
        if (active) { setNow(Date.now()); timer = setTimeout(poll, Math.max(30, config.refreshSeconds) * 1000); }
      }
    }
    poll();
    return () => { active = false; clearTimeout(timer); controller?.abort(); };
  }, [refresh]);
  const stale = data && (state === 'offline' || now - Date.parse(data.updatedAt) > 10 * 60 * 1000);
  const byDate = new Map((data?.daily || []).map(row => [row.date, row.tokens]));
  const timeZone = data?.timeZone || 'Asia/Shanghai';
  const calendarDate = new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(data?.updatedAt ? new Date(data.updatedAt) : new Date(now));
  const anchor = new Date(`${calendarDate}T12:00:00Z`);
  const days = Array.from({ length: 364 }, (_, index) => {
    const day = new Date(anchor); day.setUTCDate(day.getUTCDate() - 363 + index);
    const date = day.toISOString().slice(0, 10);
    return { date, tokens: byDate.get(date) ?? null };
  });
  const visible = days.slice(-period);
  const max = Math.max(1, ...visible.map(day => day.tokens || 0));
  const yearMax = Math.max(1, ...days.map(day => day.tokens || 0));
  return <main className="aic-page">
    <header className="aic-masthead"><span>{config.name}</span><a href="https://github.com/fyuo863" target="_blank" rel="noreferrer">GitHub ↗</a></header>
    <section className="aic-intro"><h1>AI Coding</h1></section>
    <div className="aic-status" role="status"><span><i data-ready={Boolean(data && !stale)} />{state === 'loading' ? '正在读取用量' : !data ? '等待首次同步' : stale ? '同步暂未更新 · 保留最近记录' : '已同步'}{data && <time dateTime={data.updatedAt}> / {new Date(data.updatedAt).toLocaleString('zh-CN', { hour12: false })}</time>}</span><button onClick={() => { setState('loading'); setRefresh(value => value + 1); }} disabled={state === 'loading'}>刷新 ↗</button></div>

    <section className="aic-totals" aria-label="Token 用量概览">{[['today', '今日 TOKENS'], ['month', '本月 TOKENS'], ['allTime', '累计 TOKENS']].map(([key, label]) => <div key={key}><p>{label}</p><strong title={data?.totals[key].toLocaleString()}>{fmt(data?.totals[key])}</strong></div>)}</section>
    <section className="aic-trend"><div className="aic-section-head"><div><h2>用量趋势</h2></div><div className="aic-period" aria-label="趋势时间范围">{[7, 30, 90].map(value => <button key={value} aria-pressed={period === value} onClick={() => setPeriod(value)}>{value} 天</button>)}</div></div><div className="aic-chart" role="img" aria-label={`最近 ${period} 天用量，最高 ${fmt(max === 1 ? 0 : max)} tokens`}><span className="aic-chart-scale">{data ? fmt(max === 1 ? 0 : max) : '—'} TOKENS</span><div className="aic-bars">{visible.map(day => <div key={day.date} title={`${day.date} · ${day.tokens == null ? '无记录' : day.tokens.toLocaleString() + ' tokens'}`}><span style={{ height: `${(day.tokens || 0) / max * 100}%` }} /></div>)}</div>{!data && <p className="aic-chart-empty">暂无数据</p>}</div><div className="aic-axis"><span>{visible[0].date}</span><span>{visible.at(-1).date}</span></div></section>
    <section className="aic-activity"><div className="aic-section-head"><div><h2>活跃记录</h2></div><p className="aic-muted">最近 52 周</p></div><div className="aic-heatmap" role="img" aria-label="过去 364 天的 Token 用量热力图">{days.map(day => <span key={day.date} data-level={day.tokens == null ? 'missing' : day.tokens === 0 ? 0 : Math.min(4, Math.ceil(day.tokens / yearMax * 4))} title={`${day.date} · ${day.tokens == null ? '无记录' : day.tokens.toLocaleString() + ' tokens'}`} />)}</div><p className="aic-legend">浅 → 深 · 用量由少到多 · 空心为无记录</p></section>
    <section className="aic-breakdown"><div><h2>用量分布</h2><p className="aic-muted">累计 Tokens</p></div><Ranking title="工具" rows={data?.tools} /><Ranking title="模型" rows={data?.models} /></section>
    <footer className="aic-footer"><span>{config.name}</span><span>Token Monitor</span></footer>
  </main>;
}

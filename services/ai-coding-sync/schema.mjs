const count = n => { if (!Number.isSafeInteger(n) || n < 0) throw new Error('Invalid token count'); return n; };
const dateKey = s => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && new Date(`${s}T00:00:00Z`).toISOString().slice(0, 10) === s;
const rows = list => {
  if (!Array.isArray(list) || list.length > 2000) throw new Error('Invalid breakdown');
  const seen = new Set();
  return list.map(row => {
    if (typeof row.name !== 'string' || !row.name.trim() || row.name.length > 160 || /[\u0000-\u001f]/.test(row.name) || seen.has(row.name)) throw new Error('Invalid label');
    seen.add(row.name);
    return { name: row.name, tokens: count(row.tokens) };
  });
};
// Construct a fresh allowlisted object: never persist source sessions, paths or accounts.
export function normalize(input) {
  if (input?.schemaVersion !== 1 || typeof input.updatedAt !== 'string' || !Number.isFinite(Date.parse(input.updatedAt)) || Date.parse(input.updatedAt) > Date.now() + 300000) throw new Error('Invalid snapshot');
  const timeZone = input.timeZone || 'Asia/Shanghai';
  new Intl.DateTimeFormat('en', { timeZone });
  if (!Array.isArray(input.daily) || input.daily.length > 2000) throw new Error('Invalid daily history');
  const seen = new Set();
  const daily = input.daily.map(row => {
    if (!dateKey(row.date) || seen.has(row.date)) throw new Error('Invalid or duplicate date');
    seen.add(row.date); return { date: row.date, tokens: count(row.tokens) };
  }).sort((a, b) => a.date.localeCompare(b.date)).slice(-370);
  return { schemaVersion: 1, updatedAt: new Date(input.updatedAt).toISOString(), timeZone,
    totals: Object.fromEntries(['today', 'month', 'allTime'].map(key => [key, count(input.totals?.[key])])),
    daily, tools: rows(input.tools), models: rows(input.models) };
}
export function fromExport(raw, timeZone = 'Asia/Shanghai') {
  if (raw?.app?.name !== 'token-monitor') throw new Error('Not a Token Monitor export');
  const period = raw.snapshot?.allTime;
  const breakdown = map => {
    if (!map || typeof map !== 'object' || Array.isArray(map)) throw new Error('Missing export breakdown');
    return Object.entries(map).map(([name, tokens]) => ({ name, tokens }));
  };
  return normalize({ schemaVersion: 1, updatedAt: raw.generatedAt, timeZone,
    totals: Object.fromEntries(['today', 'month', 'allTime'].map(key => [key, raw.snapshot?.[key]?.totalTokens])),
    daily: raw.daily || [], tools: breakdown(period?.clients), models: breakdown(period?.models) });
}

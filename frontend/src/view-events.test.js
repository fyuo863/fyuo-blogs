import test from 'node:test';
import assert from 'node:assert/strict';
import { createViewTracker } from './view-events.js';

test('renders share a PV; reopening creates a new event; retry is bounded and stable', async () => {
  const ids = []; let sequence = 0;
  const tracker = createViewTracker(async (...args) => {
    ids.push(args[3]); if (ids.length < 3) throw new Error('network'); return { data: {} };
  }, { now: () => 1700000000000, random: () => `${++sequence}`.padStart(32, '0'), sleep: async () => {} });
  const first = tracker.select(7, 'visitor', '/blog/7');
  assert.equal(first, tracker.select(7, 'visitor', '/blog/7'));
  await first;
  assert.equal(ids.length, 3); assert.equal(new Set(ids).size, 1);
  tracker.select(null);
  await tracker.select(7, 'visitor', '/blog/7');
  assert.equal(new Set(ids).size, 2);
});
test('permanent errors do not retry; total network attempts capped at three', async () => {
  for (const status of [400, 404, 503, undefined]) {
    let calls = 0;
    const tracker = createViewTracker(async () => { calls++; throw { response: { status } }; }, { sleep: async () => {} });
    await assert.rejects(tracker.select(1));
    assert.equal(calls, status === 400 || status === 404 ? 1 : 3);
  }
});

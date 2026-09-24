import { test } from 'node:test';
import assert from 'node:assert/strict';
import { percentile } from './run.mjs';
test('nearest rank percentiles use numeric order and include tail', () => {
  assert.equal(percentile([100, 2, 10, 1], .5), 2);
  assert.equal(percentile(Array.from({length:100}, (_,i)=>i+1), .95), 95);
  assert.equal(percentile([], .95), null);
});

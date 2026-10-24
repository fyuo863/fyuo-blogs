import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createPrediction, judgePrediction } from './prediction.js';

test('Chinese predicts a single character and checks only final recognition', () => {
  const prediction = createPrediction('今天', '天气很好');
  assert.equal(prediction.text, '天');
  assert.equal(judgePrediction(prediction, '今天晚上', false).state, 'waiting');
  assert.equal(judgePrediction(prediction, '今天，天气', true).state, 'correct');
  assert.deepEqual(judgePrediction(prediction, '今天晚上', true), { state: 'wrong', actual: '晚' });
});
test('recognizer corrections and punctuation do not count as wrong guesses', () => {
  const prediction = createPrediction('今天', '天');
  assert.equal(judgePrediction(prediction, '今天。', true).state, 'waiting');
  assert.equal(judgePrediction(prediction, '明天天气', true).state, 'invalidated');
});
test('English compares a whole word, not a prefix, ignoring case', () => {
  const prediction = createPrediction('I like', 'apples and oranges', 'en-US');
  assert.equal(prediction.text, 'apples');
  assert.equal(judgePrediction(prediction, 'I like Apples.', true).state, 'correct');
  assert.equal(judgePrediction(prediction, 'I like apple', true).state, 'wrong');
  assert.equal(createPrediction('Hello', '...', 'en-US'), null);
});

// Predictions are anchored to confirmed text, never to revisable ASR hypotheses.
export function units(text, language = 'zh-CN') {
  const cleaned = text.normalize('NFKC');
  if (language.startsWith('zh')) return [...cleaned].filter(char => /[\p{L}\p{N}]/u.test(char));
  return cleaned.match(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu) || [];
}

export function createPrediction(confirmed, candidate, language = 'zh-CN') {
  const next = units(candidate, language)[0];
  if (!next) return null;
  return { anchor: units(confirmed, language), text: next, language };
}

export function judgePrediction(prediction, confirmed, isFinal) {
  if (!prediction || !isFinal) return { state: 'waiting' };
  const actual = units(confirmed, prediction.language);
  const same = (a, b) => a?.toLocaleLowerCase() === b?.toLocaleLowerCase();
  // A revised recognition prefix invalidates the prediction rather than marking it wrong.
  if (!prediction.anchor.every((token, i) => same(token, actual[i]))) return { state: 'invalidated' };
  const next = actual[prediction.anchor.length];
  if (!next) return { state: 'waiting' };
  return { state: same(next, prediction.text) ? 'correct' : 'wrong', actual: next };
}

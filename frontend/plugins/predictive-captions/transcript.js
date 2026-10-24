// Reject pathological decoder loops; do not "repair" them into invented subtitles.
export function cleanTranscript(text) {
  const value = text.trim();
  const compact = value.replace(/[\p{P}\p{Z}\s]/gu, '').toLowerCase();
  if (!compact) return '';
  if (/(.{1,12})\1{3,}/u.test(compact)) return '';
  if (compact.length >= 12) {
    const counts = new Map();
    for (const char of compact) counts.set(char, (counts.get(char) || 0) + 1);
    if (Math.max(...counts.values()) / compact.length > 0.75) return '';
  }
  return value;
}

export function hasAudioSignal(pcm) {
  if (!pcm || pcm.length < 16000 * 0.4) return false;
  let sum = 0, square = 0;
  for (const sample of pcm) { if (!Number.isFinite(sample)) return false; sum += sample; square += sample * sample; }
  // DC offset is not speech.
  return Math.sqrt(Math.max(0, square / pcm.length - (sum / pcm.length) ** 2)) >= 0.006;
}

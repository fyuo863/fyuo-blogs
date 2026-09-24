// One selection/open is one PV. Re-rendering and retrying reuse the same event.
export function createViewTracker(send, {
  now = Date.now,
  random = () => crypto.randomUUID().replaceAll('-', ''),
  sleep = ms => new Promise(resolve => setTimeout(resolve, ms)),
} = {}) {
  let current = null;
  return {
    select(articleId, visitorId, contentPath) {
      if (!articleId) { current = null; return null; }
      if (current?.articleId === articleId) return current.promise;
      const eventId = `${now()}-${random()}`;
      const promise = (async () => {
        for (let attempt = 0; attempt < 3; attempt++) {
          try { return await send(articleId, visitorId, contentPath, eventId); }
          catch (error) {
            const status = error.response?.status;
            if (attempt === 2 || (status && status !== 429 && status < 500)) throw error;
            await sleep(500 * 2 ** attempt);
          }
        }
      })();
      current = { articleId, promise };
      return promise;
    },
  };
}

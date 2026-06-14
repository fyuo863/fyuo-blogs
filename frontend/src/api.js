import axios from "axios";

const BASE = "/api/v1";

const authConfig = (token) =>
  token
    ? {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    : {};

// ============================================================
//  Auth
// ============================================================

/** POST /api/v1/signin — 登录 */
export const signIn = (name, password) =>
  axios.post(`${BASE}/signin`, { name, password });

/** POST /api/v1/signup — 注册 */
export const signUp = (name, password) =>
  axios.post(`${BASE}/signup`, { name, password });

// ============================================================
//  Articles (public)
// ============================================================

/** GET /api/v1/articles — 获取文章列表 */
export const listArticles = () => axios.get(`${BASE}/articles`);

/** GET /api/v1/articles/search?q= — 搜索文章 */
export const searchArticles = (query) =>
  axios.get(`${BASE}/articles/search`, { params: { q: query } });

/** GET /api/v1/articles/:id — 获取单篇文章 */
export const getArticle = (id) => axios.get(`${BASE}/articles/${id}`);

// ============================================================
//  Articles (protected — 需 JWT)
// ============================================================

/** POST /api/v1/articles — 创建文章 */
export const createArticle = (data, token) =>
  axios.post(`${BASE}/articles`, data, authConfig(token));

/** PUT /api/v1/articles/:id — 更新文章 */
export const updateArticle = (id, data, token) =>
  axios.put(`${BASE}/articles/${id}`, data, authConfig(token));

/** DELETE /api/v1/articles/:id — 删除文章 */
export const deleteArticle = (id, token) =>
  axios.delete(`${BASE}/articles/${id}`, authConfig(token));

export const uploadArticleImage = (file, token) => {
  const formData = new FormData();
  formData.append("file", file);
  return axios.post(`${BASE}/uploads/images`, formData, {
    ...authConfig(token),
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      "Content-Type": "multipart/form-data",
    },
  });
};

// ============================================================
//  Counters (public)
// ============================================================

/** POST /api/v1/articles/:id/view — 增加浏览次数 */
export const incrementView = (id) => axios.post(`${BASE}/articles/${id}/view`);

/** POST /api/v1/articles/:id/like — 增加点赞数（IP 限频） */
export const incrementLike = (id) => axios.post(`${BASE}/articles/${id}/like`);

export const recordArticleView = (id, visitorId, contentPath) =>
  axios.post(`${BASE}/articles/${id}/view`, null, {
    headers: {
      "X-Visitor-Id": visitorId,
      "X-Content-Path": contentPath,
    },
  });

export const listVisitRecords = (token, params = {}) =>
  axios.get(`${BASE}/visit-records`, {
    ...authConfig(token),
    params,
  });

export const listPublisherUsers = (token) =>
  axios.get(`${BASE}/admin/publisher-users`, authConfig(token));

export const listApiKeys = (token) =>
  axios.get(`${BASE}/admin/api-keys`, authConfig(token));

export const createApiKey = (token, data) =>
  axios.post(`${BASE}/admin/api-keys`, data, authConfig(token));

export const updateApiKey = (token, id, data) =>
  axios.patch(`${BASE}/admin/api-keys/${id}`, data, authConfig(token));

export const rotateApiKey = (token, id) =>
  axios.post(`${BASE}/admin/api-keys/${id}/rotate`, {}, authConfig(token));

export const deleteApiKey = (token, id) =>
  axios.delete(`${BASE}/admin/api-keys/${id}`, authConfig(token));

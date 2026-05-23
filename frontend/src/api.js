import axios from "axios";

const BASE = "http://localhost:8090/api/v1";

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

/** GET /api/v1/articles/:id — 获取单篇文章 */
export const getArticle = (id) => axios.get(`${BASE}/articles/${id}`);

// ============================================================
//  Articles (protected — 需 JWT)
// ============================================================

/** POST /api/v1/articles — 创建文章（name + password 验证） */
export const createArticle = (data) =>
  axios.post(`${BASE}/articles`, data);

/** PUT /api/v1/articles/:id — 更新文章（name + password 验证） */
export const updateArticle = (id, data) =>
  axios.put(`${BASE}/articles/${id}`, data);

/** DELETE /api/v1/articles/:id — 删除文章（name + password 验证） */
export const deleteArticle = (id, data) =>
  axios.delete(`${BASE}/articles/${id}`, { data });

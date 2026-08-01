import axios from "axios";

const BASE = "/api/v1";
const BACKEND_OFFLINE = import.meta.env.VITE_BACKEND_OFFLINE === "true";

const mockDelay = (ms = 120) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const offlineResponse = async (data = {}) => {
  await mockDelay();

  return {
    data,
    status: 200,
    statusText: "OK",
    headers: {},
    config: {},
  };
};

const offlineUnavailable = async (message = "Backend is offline.") => {
  await mockDelay();

  const err = new Error(message);
  err.isBackendOffline = true;
  throw err;
};

export const isBackendOfflineError = (err) => {
  return Boolean(
    err?.isBackendOffline ||
      (typeof err?.response?.status === "number" && err.response.status >= 500) ||
      err?.code === "ERR_NETWORK" ||
      err?.code === "ECONNABORTED" ||
      err?.message === "Network Error" ||
      (!err?.response && err?.request)
  );
};

const api = axios.create({
  baseURL: BASE,
  timeout: 3500,
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (!err.response && (err.request || err.message === "Network Error")) {
      err.isBackendOffline = true;
      err.message =
        "Backend is not connected. Start the backend server to enable blog data.";
    }

    return Promise.reject(err);
  }
);

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

export const signIn = (name, password) => {
  if (BACKEND_OFFLINE) {
    return offlineUnavailable("Backend is offline. Sign in is unavailable.");
  }

  return api.post("/signin", { name, password });
};

export const signUp = (name, password) => {
  if (BACKEND_OFFLINE) {
    return offlineUnavailable("Backend is offline. Sign up is unavailable.");
  }

  return api.post("/signup", { name, password });
};

// ============================================================
//  Articles (public)
// ============================================================

export const listArticles = () => {
  if (BACKEND_OFFLINE) {
    return offlineResponse({
      data: [],
      backendOffline: true,
    });
  }

  return api.get("/articles");
};

export const searchArticles = (query) => {
  if (BACKEND_OFFLINE) {
    return offlineResponse({
      data: [],
      backendOffline: true,
      query,
    });
  }

  return api.get("/articles/search", {
    params: {
      q: query,
    },
  });
};

export const getArticle = (id) => {
  if (BACKEND_OFFLINE) {
    return offlineUnavailable(`Backend is offline. Article ${id} unavailable.`);
  }

  return api.get(`/articles/${id}`);
};

// ============================================================
//  Articles (protected)
// ============================================================

export const createArticle = (data, token) => {
  if (BACKEND_OFFLINE) {
    return offlineUnavailable("Backend is offline. Create article unavailable.");
  }

  return api.post("/articles", data, authConfig(token));
};

export const updateArticle = (id, data, token) => {
  if (BACKEND_OFFLINE) {
    return offlineUnavailable("Backend is offline. Update article unavailable.");
  }

  return api.put(`/articles/${id}`, data, authConfig(token));
};

export const deleteArticle = (id, token) => {
  if (BACKEND_OFFLINE) {
    return offlineUnavailable("Backend is offline. Delete article unavailable.");
  }

  return api.delete(`/articles/${id}`, authConfig(token));
};

export const uploadArticleImage = (file, token) => {
  if (BACKEND_OFFLINE) {
    return offlineUnavailable("Backend is offline. Upload unavailable.");
  }

  const formData = new FormData();
  formData.append("file", file);

  return api.post("/uploads/images", formData, {
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

export const incrementView = (id) => {
  if (BACKEND_OFFLINE) {
    return offlineResponse({
      view_count: 0,
      backendOffline: true,
      id,
    });
  }

  return api.post(`/articles/${id}/view`);
};

export const incrementLike = (id) => {
  if (BACKEND_OFFLINE) {
    return offlineResponse({
      liked: false,
      like_count: 0,
      backendOffline: true,
      id,
    });
  }

  return api.post(`/articles/${id}/like`);
};

export const recordArticleView = (id, visitorId, contentPath) => {
  if (BACKEND_OFFLINE) {
    return offlineResponse({
      view_count: 0,
      backendOffline: true,
      id,
      visitorId,
      contentPath,
    });
  }

  return api.post(`/articles/${id}/view`, null, {
    headers: {
      "X-Visitor-Id": visitorId,
      "X-Content-Path": contentPath,
    },
  });
};

// ============================================================
//  Admin
// ============================================================

export const listVisitRecords = (token, params = {}) => {
  if (BACKEND_OFFLINE) {
    return offlineResponse({
      data: [],
      backendOffline: true,
      params,
    });
  }

  return api.get("/visit-records", {
    ...authConfig(token),
    params,
  });
};

export const listPublisherUsers = (token) => {
  if (BACKEND_OFFLINE) {
    return offlineResponse({
      data: [],
      backendOffline: true,
    });
  }

  return api.get("/admin/publisher-users", authConfig(token));
};

export const listApiKeys = (token) => {
  if (BACKEND_OFFLINE) {
    return offlineResponse({
      data: [],
      backendOffline: true,
    });
  }

  return api.get("/admin/api-keys", authConfig(token));
};

export const createApiKey = (token, data) => {
  if (BACKEND_OFFLINE) {
    return offlineUnavailable("Backend is offline. Create API key unavailable.");
  }

  return api.post("/admin/api-keys", data, authConfig(token));
};

export const updateApiKey = (token, id, data) => {
  if (BACKEND_OFFLINE) {
    return offlineUnavailable("Backend is offline. Update API key unavailable.");
  }

  return api.patch(`/admin/api-keys/${id}`, data, authConfig(token));
};

export const rotateApiKey = (token, id) => {
  if (BACKEND_OFFLINE) {
    return offlineUnavailable("Backend is offline. Rotate API key unavailable.");
  }

  return api.post(`/admin/api-keys/${id}/rotate`, {}, authConfig(token));
};

export const deleteApiKey = (token, id) => {
  if (BACKEND_OFFLINE) {
    return offlineUnavailable("Backend is offline. Delete API key unavailable.");
  }

  return api.delete(`/admin/api-keys/${id}`, authConfig(token));
};

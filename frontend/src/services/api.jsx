import axios from 'axios';

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL ?? ''}/api`,
  headers: { 'Content-Type': 'application/json' },
});

// ── Attach JWT token ─────────────────────────────────────
API.interceptors.request.use(cfg => {
  const token = localStorage.getItem('ers_token');
  if (token) {
    cfg.headers.Authorization = `Bearer ${token}`;
  }
  return cfg;
});

// ── Auto logout on 401 ───────────────────────────────────
API.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('ers_token');
      localStorage.removeItem('ers_user');
      window.location.href = "/login"; // better than reload
    }
    return Promise.reject(err);
  }
);

// ── Auth ─────────────────────────────────────────────────
export const apiLogin = (email, password) =>
  API.post('/auth/login', { email, password });

export const apiRegister = (data) =>
  API.post('/auth/register', data);

// ── Employees / Data ─────────────────────────────────────
export const apiGetEmployees = (page = 0, size = 50) =>
  API.get(`/data?page=${page}&size=${size}`);

export const apiGetStats = () =>
  API.get('/data/stats');

export const apiUpload = (file, onProgress) => {
  const fd = new FormData();
  fd.append('file', file);

  return API.post('/data/upload', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: e =>
      onProgress && onProgress(Math.round((e.loaded * 100) / e.total)),
  });
};

// ── Reports ──────────────────────────────────────────────
export const apiGetReports = (page = 0, size = 20) =>
  API.get(`/reports?page=${page}&size=${size}`);

export const apiGetReport = (id) =>
  API.get(`/reports/${id}`);

export const apiSaveReport = (data) =>
  API.post('/reports/save', data);

export const apiDeleteReport = (id) =>
  API.delete(`/reports/${id}`);

// ── Admin ────────────────────────────────────────────────
export const apiGetUsers = () =>
  API.get('/admin/users');

export const apiCreateUser = (data) =>
  API.post('/admin/users', data);

export const apiUpdateRole = (id, role) =>
  API.put(`/admin/users/${id}/role`, { role });

export const apiDeleteUser = (id) =>
  API.delete(`/admin/users/${id}`);

export const apiGetLogs = (page = 0, size = 50) =>
  API.get(`/admin/logs?page=${page}&size=${size}`);

export default API;

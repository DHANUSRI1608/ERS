import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const authService = {
  login: async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },
};

export const reportService = {
  getWeeklyPdf: async (username) => {
    const response = await api.get(`/reports/generate-weekly/pdf?username=${username}`, {
      responseType: 'blob',
    });
    return response.data;
  },
  getWeeklyExcel: async (username) => {
    const response = await api.get(`/reports/generate-weekly/excel?username=${username}`, {
      responseType: 'blob',
    });
    return response.data;
  },
  getHistory: async () => {
    const response = await api.get('/reports/history');
    return response.data;
  },
};

export const analyticsService = {
  getWeeklyMetrics: async () => {
    const response = await api.get('/analytics/weekly-metrics');
    return response.data;
  },
  getSummary: async () => {
    const response = await api.get('/analytics/summary');
    return response.data;
  },
  getRevenueTrend: async () => {
    const response = await api.get('/analytics/revenue');
    return response.data;
  },
};

export const userService = {
  getAll: async () => {
    const response = await api.get('/users');
    return response.data;
  },
  create: async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
  },
  update: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },
  delete: async (id) => {
    await api.delete(`/users/${id}`);
  },
  updateProfile: async (userData) => {
    const response = await api.put('/users/profile', userData);
    return response.data;
  },
};

export const auditService = {
  getLogs: async () => {
    const response = await api.get('/audit');
    return response.data;
  },
};

export const uploadService = {
  upload: async (file, username) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('username', username);
    const response = await api.post('/uploads', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  getUploads: async () => {
    const response = await api.get('/uploads');
    return response.data;
  },
  delete: async (id) => {
    await api.delete(`/uploads/${id}`);
  },
};

export default api;

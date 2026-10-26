import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('cpms_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

export const jobAPI = {
  getAll: () => api.get('/jobs'),
  getById: (id) => api.get(`/jobs/${id}`),
  search: (params) => api.get('/jobs/search', { params }),
  getMyJobs: () => api.get('/jobs/company/my'),
  getAllAdmin: () => api.get('/jobs/all'),
  create: (data) => api.post('/jobs', data),
  update: (id, data) => api.put(`/jobs/${id}`, data),
  delete: (id) => api.delete(`/jobs/${id}`),
};

export const applicationAPI = {
  apply: (jobId, data) => api.post(`/applications/apply/${jobId}`, data),
  myApplications: () => api.get('/applications/my'),
  byJob: (jobId) => api.get(`/applications/job/${jobId}`),
  updateStatus: (appId, status) => api.put(`/applications/${appId}/status`, { status }),
  getStats: () => api.get('/applications/stats'),
  scheduleInterview: (appId, data) => api.post(`/applications/${appId}/interview`, data),
  myInterviews: () => api.get('/applications/interviews/my'),
};

export const studentAPI = {
  getProfile: () => api.get('/students/profile'),
  updateProfile: (data) => api.put('/students/profile', data),
  uploadResume: (formData) => api.post('/students/resume', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getAll: () => api.get('/students'),
};

export const companyAPI = {
  getProfile: () => api.get('/companies/profile'),
  updateProfile: (data) => api.put('/companies/profile', data),
  getAll: () => api.get('/companies'),
};

export const chatAPI = {
  createSession: () => api.post('/chat/session'),
  send: (sessionId, content) => api.post(`/chat/session/${sessionId}`, { content }),
  getHistory: (sessionId) => api.get(`/chat/session/${sessionId}/history`),
  deleteSession: (sessionId) => api.delete(`/chat/session/${sessionId}`),
};

export const notificationAPI = {
  getAll: () => api.get('/notifications'),
  getUnread: () => api.get('/notifications/unread'),
  getCount: () => api.get('/notifications/count'),
  markRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/read-all'),
  delete: (id) => api.delete(`/notifications/${id}`),
};

export const reviewAPI = {
  getByCompany: (companyId) => api.get(`/reviews/company/${companyId}`),
  submit: (data) => api.post('/reviews', data),
  getMy: () => api.get('/reviews/my'),
};

export const experienceAPI = {
  getAll: (company) => api.get('/experiences', { params: company ? { company } : {} }),
  share: (data) => api.post('/experiences', data),
  delete: (id) => api.delete(`/experiences/${id}`),
};

export const portfolioAPI = {
  get: (userId) => api.get(`/portfolio/${userId}`),
  getRecommended: () => api.get('/jobs/recommended'),
  getSkillGap: (jobId) => api.get(`/jobs/${jobId}/skill-gap`),
  getRanking: () => api.get('/students/ranking'),
};

export default api;

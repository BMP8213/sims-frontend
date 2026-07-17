import axios from 'axios';

const baseUrl = 'http://localhost:8000/api/';
const tokenStorageKeys = ['sims_token', 'access_token', 'token'];

const clearStoredTokens = () => {
  tokenStorageKeys.forEach((key) => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  });
};

const api = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

let __unauthorizedCount = 0;

api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem('access_token') ||
    sessionStorage.getItem('access_token') ||
    localStorage.getItem('sims_token') ||
    sessionStorage.getItem('sims_token') ||
    localStorage.getItem('token') ||
    sessionStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config;
    const status = error?.response?.status;
    // reset counter on any successful response path
    if (status !== 401) {
      __unauthorizedCount = 0;
    }

    if (status === 401) {
      __unauthorizedCount += 1;

      try {
        window.dispatchEvent(new CustomEvent('sims:auth:expired', { detail: { message: 'Authentication expired. Please sign in again.' } }));
      } catch (e) {
        console.warn('Could not dispatch auth expired event', e);
      }

      if (originalRequest && !originalRequest._retry && !originalRequest.url?.includes('/auth/')) {
        clearStoredTokens();
        originalRequest._retry = true;
        delete originalRequest.headers.Authorization;
        return api.request(originalRequest);
      }

      // clear tokens for single 401 as well
      clearStoredTokens();
    }

    return Promise.reject(error);
  }
);

export default api;

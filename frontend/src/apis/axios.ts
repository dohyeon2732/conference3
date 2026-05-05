import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }
  return config;

  // const noAuthPaths = ['/users/login'];

  // const url = config.url || '';

  // if (!noAuthPaths.some((path) => url.includes(path))) {
  //   const token = localStorage.getItem('accessToken');
  //   if (token && config.headers) {
  //     config.headers['Authorization'] = `Bearer ${token}`;
  //   }
  // }
  // return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      window.location.href = '/';
    }
    return Promise.reject(error);
  },
);

export default api;

import axios from 'axios';
export const API_BASE_URL = 'https://alfa-api.servicesbr.duckdns.org';

const api = axios.create({
  baseURL: API_BASE_URL
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('alfa_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Clear token and force logout on expiration or invalid token
      localStorage.removeItem('alfa_token');
      localStorage.removeItem('alfa_perfil');
      localStorage.removeItem('alfa_nome');
      window.location.href = '/alfaacademy/admin/#/login';
    }
    return Promise.reject(error);
  }
);

export default api;


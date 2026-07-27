import os

# Create directories
dirs = ['src/context', 'src/pages', 'src/components']
for d in dirs:
    os.makedirs(f"crm/{d}", exist_ok=True)

# 1. API Client
api_js = """import axios from 'axios';
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
export default api;
"""
with open("crm/src/api.js", "w", encoding="utf-8") as f: f.write(api_js)

# 2. AuthContext
auth_js = """import { createContext, useState, useEffect } from 'react';
import api from '../api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('alfa_token');
    const perfil = localStorage.getItem('alfa_perfil');
    const nome = localStorage.getItem('alfa_nome');
    if (token) {
      setUser({ token, perfil, nome });
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const res = await api.post('/api/auth/login', { username, password });
    if (res.data.token) {
      localStorage.setItem('alfa_token', res.data.token);
      localStorage.setItem('alfa_perfil', res.data.perfil);
      localStorage.setItem('alfa_nome', res.data.nome);
      setUser(res.data);
      return res.data;
    }
    throw new Error('Falha no login');
  };

  const logout = () => {
    localStorage.removeItem('alfa_token');
    localStorage.removeItem('alfa_perfil');
    localStorage.removeItem('alfa_nome');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
"""
with open("crm/src/context/AuthContext.jsx", "w", encoding="utf-8") as f: f.write(auth_js)

# 3. CSS (index.css)
index_css = """
:root {
  --ouro: #F8C146; --ouro-esc: #C99520;
  --preto: #0F0F10; --painel: #1A1A1C; --linha: #2C2C30;
  --texto: #F3F1EA; --cinza: #9A968C; --radius: 12px;
  --bg: #141416;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: 'Inter', sans-serif;
  background-color: var(--bg);
  color: var(--texto);
}
a { color: inherit; text-decoration: none; }
button { cursor: pointer; border: none; font-family: 'Inter', sans-serif; }
.btn {
  background: var(--ouro); color: #111; font-weight: bold;
  padding: 12px 24px; border-radius: 8px; transition: 0.2s;
}
.btn:hover { background: #FFD166; transform: translateY(-1px); }
.btn.outline {
  background: transparent; border: 1px solid var(--ouro); color: var(--ouro);
}
input, select, textarea {
  width: 100%; padding: 12px; background: rgba(0,0,0,0.3);
  border: 1px solid var(--linha); color: var(--texto); border-radius: 8px;
  outline: none; margin-top: 8px; margin-bottom: 16px;
}
input:focus { border-color: var(--ouro); }
.card {
  background: var(--painel); border: 1px solid var(--linha);
  padding: 24px; border-radius: var(--radius);
}
"""
with open("crm/src/index.css", "w", encoding="utf-8") as f: f.write(index_css)


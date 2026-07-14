import { createContext, useState, useEffect } from 'react';
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
    const res = await api.post('/api/auth/login', { usuario: username, senha: password });
    if (res.data.token) {
      localStorage.setItem('alfa_token', res.data.token);
      localStorage.setItem('alfa_perfil', res.data.usuario?.perfil);
      localStorage.setItem('alfa_nome', res.data.usuario?.nome);
      setUser({ token: res.data.token, perfil: res.data.usuario?.perfil, nome: res.data.usuario?.nome });
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

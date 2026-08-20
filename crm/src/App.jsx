
import React from 'react';
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    this.setState({ error, info });
    console.error("ErrorBoundary caught an error", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20, color: 'white', background: 'red' }}>
          <h2>Oops, the app crashed!</h2>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: 12 }}>
            {this.state.error && this.state.error.toString()}
          </pre>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: 12, marginTop: 10 }}>
            {this.state.info && this.state.info.componentStack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';
import Login from './pages/Login';
import Layout from './components/Layout';
import Overview from './pages/Overview';
import Athletes from './pages/Athletes';
import PerfilAtleta from './pages/PerfilAtleta';
import GeradorRelatorios from './pages/GeradorRelatorios';
import Staff from './pages/Staff';
import CentralPerformance from './pages/CentralPerformance';
import Categories from './pages/Categories';
import Attendance from './pages/Attendance';
import AttendanceHistory from './pages/AttendanceHistory';
import AttendanceReport from './pages/AttendanceReport';
import Games from './pages/Games';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div>Carregando...</div>;
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.perfil)) {
    return <Navigate to="/" />; // Fallback
  }
  return children;
};

export default function App() {
  return (
    <ErrorBoundary>
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route index element={<Overview />} />
            <Route path="atletas" element={<PrivateRoute allowedRoles={['Administrador', 'admin', 'Admin']}><Athletes /></PrivateRoute>} />
            <Route path="perfil/:id" element={<PrivateRoute allowedRoles={['Administrador', 'admin', 'Admin']}><PerfilAtleta /></PrivateRoute>} />
            <Route path="relatorios" element={<PrivateRoute allowedRoles={['Administrador', 'admin', 'Admin']}><GeradorRelatorios /></PrivateRoute>} />
            <Route path="equipe" element={<PrivateRoute allowedRoles={['Administrador', 'admin', 'Admin']}><Staff /></PrivateRoute>} />
            <Route path="performance" element={<PrivateRoute allowedRoles={['Administrador', 'admin', 'Admin']}><CentralPerformance /></PrivateRoute>} />
            <Route path="categorias" element={<PrivateRoute allowedRoles={['Administrador', 'admin', 'Admin']}><Categories /></PrivateRoute>} />
            <Route path="chamada" element={<Attendance />} />
            <Route path="historico-chamadas" element={<AttendanceHistory />} />
            <Route path="frequencia" element={<AttendanceReport />} />
            <Route path="jogos" element={<Games />} />
          </Route>
        </Routes>
      </HashRouter>
    </AuthProvider>
    </ErrorBoundary>
  );
}

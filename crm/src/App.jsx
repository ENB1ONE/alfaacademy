import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';
import Login from './pages/Login';
import Layout from './components/Layout';
import Overview from './pages/Overview';
import Athletes from './pages/Athletes';
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
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route index element={<Overview />} />
            <Route path="atletas" element={<PrivateRoute allowedRoles={['Administrador', 'admin', 'Admin']}><Athletes /></PrivateRoute>} />
            <Route path="equipe" element={<PrivateRoute allowedRoles={['Administrador', 'admin', 'Admin']}><Staff /></PrivateRoute>} />
            <Route path="categorias" element={<PrivateRoute allowedRoles={['Administrador', 'admin', 'Admin']}><Categories /></PrivateRoute>} />
            <Route path="chamada" element={<Attendance />} />
            <Route path="historico-chamadas" element={<AttendanceHistory />} />
            <Route path="frequencia" element={<AttendanceReport />} />
            <Route path="jogos" element={<Games />} />
          </Route>
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
}

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';
import Login from './pages/Login';
import Layout from './components/Layout';
import Overview from './pages/Overview';
import Athletes from './pages/Athletes';
import Staff from './pages/Staff';
import Notices from './pages/Notices';
import Attendance from './pages/Attendance';

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
      <BrowserRouter basename="/alfaacademy/crm">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route index element={<Overview />} />
            <Route path="atletas" element={<PrivateRoute allowedRoles={['Administrador', 'admin']}><Athletes /></PrivateRoute>} />
            <Route path="equipe" element={<PrivateRoute allowedRoles={['Administrador', 'admin']}><Staff /></PrivateRoute>} />
            <Route path="avisos" element={<PrivateRoute allowedRoles={['Administrador', 'admin']}><Notices /></PrivateRoute>} />
            <Route path="chamada" element={<Attendance />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

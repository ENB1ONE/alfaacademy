import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, Users, UserCog, ClipboardCheck, BookOpen, LogOut, Folders } from 'lucide-react';

export default function Layout() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdmin = ['Administrador', 'admin', 'Admin'].includes(user?.perfil);

  const NavLink = ({ to, icon: Icon, children }) => {
    const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));
    return (
      <Link to={to} style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px',
        color: isActive ? 'var(--ouro)' : 'var(--texto)',
        background: isActive ? 'rgba(248, 193, 70, 0.1)' : 'transparent',
        borderRadius: 8, transition: '0.2s', textDecoration: 'none'
      }}>
        <Icon size={20} color={isActive ? 'var(--ouro)' : 'var(--cinza)'} /> {children}
      </Link>
    );
  };

  return (
    <div className="layout" style={{ display: 'flex', minHeight: '100vh' }}>
      <aside className="sidebar" style={{ width: 260, flexShrink: 0, background: 'var(--painel)', borderRight: '1px solid var(--linha)', padding: 20, display: 'flex', flexDirection: 'column' }}>
        <div style={{ textAlign: 'center', marginBottom: 30 }}><img src='/alfaacademy/admin/alfa_logo.png' alt='Alfa Academy' style={{ width: 120 }} /></div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <NavLink to="/" icon={LayoutDashboard}>Visão Geral</NavLink>
          <NavLink to="/chamada" icon={ClipboardCheck}>Lista de Chamada</NavLink>
          {isAdmin && (
            <>
              <NavLink to="/atletas" icon={Users}>Atletas</NavLink>
              
          {isAdmin && (
            <>
              <NavLink to="/equipe" icon={UserCog}>Treinadores</NavLink>
              <NavLink to="/categorias" icon={Folders}>Categorias</NavLink>
            </>
          )}

            </>
          )}
        </nav>
        <button onClick={handleLogout} className="btn outline" style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          <LogOut size={18} /> Sair
        </button>
      </aside>
      <main className="main-content" style={{ flexGrow: 1, padding: 40, overflowY: 'auto', overflowX: 'hidden' }}>
        <Outlet />
      </main>
    </div>
  );
}

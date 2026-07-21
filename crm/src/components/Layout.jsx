import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useState } from 'react';
import { LayoutDashboard, Menu, X,, Users, UserCog, ClipboardCheck, BookOpen, LogOut, Folders } from 'lucide-react';

export default function Layout() {
  const { user, logout } = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    setIsMobileMenuOpen(false);
    logout();
    navigate('/login');
  };

  const isAdmin = ['Administrador', 'admin', 'Admin'].includes(user?.perfil);

  const NavLink = ({ to, icon: Icon, children }) => {
    const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));
    return (
      <Link to={to} onClick={() => setIsMobileMenuOpen(false)} style={{
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
        <div className="layout" style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      
      {/* Mobile Header */}
      <div className="mobile-header" style={{ display: 'none', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px', background: 'var(--painel)', borderBottom: '1px solid var(--linha)' }}>
        <img src='/alfaacademy/admin/alfa_logo.png' alt='Alfa Academy' style={{ width: 100 }} />
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} style={{ background: 'none', border: 'none', color: 'var(--ouro)' }}>
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      <div style={{ display: 'flex', flexGrow: 1, position: 'relative' }}>

      <aside className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`} style={{ width: 260, flexShrink: 0, background: 'var(--painel)', borderRight: '1px solid var(--linha)', padding: 20, display: 'flex', flexDirection: 'column' }}>
        <div style={{ textAlign: 'center', marginBottom: 30 }}><img src='/alfaacademy/admin/alfa_logo.png' alt='Alfa Academy' style={{ width: 120 }} /></div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <NavLink to="/" icon={LayoutDashboard}>Visão Geral</NavLink>
          <NavLink to="/chamada" icon={ClipboardCheck}>Lista de Chamada</NavLink>
          <NavLink to="/historico-chamadas" icon={BookOpen}>Histórico de Presenças</NavLink>
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
    </div>
  );
}

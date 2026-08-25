import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import api from '../api';
import { LayoutDashboard, Menu, X, Users, UserCog, ClipboardCheck, BookOpen, LogOut, Folders, Activity, Trophy } from 'lucide-react';

export default function Layout() {
  const { user, logout } = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [proximosJogos, setProximosJogos] = useState([]);

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
        display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
        color: isActive ? 'var(--ouro)' : 'var(--texto)',
        background: isActive ? 'linear-gradient(90deg, rgba(248, 193, 70, 0.15) 0%, transparent 100%)' : 'transparent',
        borderLeft: isActive ? '3px solid var(--ouro)' : '3px solid transparent',
        borderRadius: '0 8px 8px 0', transition: 'var(--transition)', textDecoration: 'none',
        fontWeight: isActive ? '600' : '400'
      }} className="nav-link"
      onMouseEnter={(e) => { if(!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
      onMouseLeave={(e) => { if(!isActive) e.currentTarget.style.background = 'transparent'; }}>
        <Icon size={20} color={isActive ? 'var(--ouro)' : 'var(--cinza)'} /> {children}
      </Link>
    );
  };

  return (
        <div className="layout">
      
      {/* Mobile Header */}
      <div className="mobile-header">
        <img src='/alfaacademy/admin/alfa_logo.png' alt='Alfa Academy' style={{ width: 100 }} />
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} style={{ background: 'none', border: 'none', color: 'var(--ouro)' }}>
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      <div style={{ display: 'flex', flexGrow: 1, position: 'relative' }}>

      <aside className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <div style={{ textAlign: 'center', marginBottom: 30 }}><img src='/alfaacademy/admin/alfa_logo.png' alt='Alfa Academy' style={{ width: 120 }} /></div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <NavLink to="/" icon={LayoutDashboard}>Visão Geral</NavLink>
          <NavLink to="/chamada" icon={ClipboardCheck}>Lista de Chamada</NavLink>
          <NavLink to="/historico-chamadas" icon={BookOpen}>Histórico de Presenças</NavLink>
          <NavLink to="/frequencia" icon={Activity}>Frequência Geral</NavLink>
          <NavLink to="/jogos" icon={Trophy}>Jogos / Convocações</NavLink>
          {isAdmin && (
            <>
              <NavLink to="/performance" icon={Activity}>Central Performance</NavLink>
              <NavLink to="/relatorios" icon={Activity}>Central de Relatórios</NavLink>
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
        
        <button onClick={handleLogout} className="btn outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 'auto' }}>
          <LogOut size={18} /> Sair
        </button>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
      </div>
    </div>
  );
}


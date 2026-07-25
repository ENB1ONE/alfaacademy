import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import api from '../api';
import { LayoutDashboard, Menu, X, Users, UserCog, ClipboardCheck, BookOpen, LogOut, Folders, Activity } from 'lucide-react';

export default function Layout() {
  const { user, logout } = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [proximosJogos, setProximosJogos] = useState([]);

  useEffect(() => {
    api.get('/api/admin/eventos/proximos').then(res => setProximosJogos(res.data)).catch(console.error);
  }, []);
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
        
        <div style={{ marginTop: 'auto', marginBottom: 20, background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: 15, border: '1px solid var(--linha)' }}>
            <h4 style={{ color: 'var(--ouro)', margin: '0 0 10px 0', fontSize: 14 }}>Próximos Jogos (10 dias)</h4>
            {proximosJogos.length === 0 ? (
                <p style={{ margin: 0, color: 'var(--cinza)', fontSize: 12 }}>Nenhum jogo agendado.</p>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {proximosJogos.map(j => (
                        <li key={j.id} style={{ fontSize: 12, borderBottom: '1px solid var(--linha)', paddingBottom: 5 }}>
                            <strong style={{ color: '#EF4444' }}>{j.data_br}</strong>
                            <div style={{ color: 'var(--texto)' }}>{j.titulo}</div>
                            <div style={{ color: 'var(--cinza)', fontSize: 10 }}>{j.categoria_nome}</div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
        <button onClick={handleLogout} className="btn outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
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

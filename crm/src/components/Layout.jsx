import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, Users, UserCog, Megaphone, ClipboardCheck, LogOut } from 'lucide-react';

export default function Layout() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdmin = user?.perfil === 'Administrador' || user?.perfil === 'admin';

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{ width: 250, background: 'var(--painel)', borderRight: '1px solid var(--linha)', padding: 20 }}>
        <h2 style={{ color: 'var(--ouro)', marginBottom: 40, textAlign: 'center' }}>Alfa Academy</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 10 }}><LayoutDashboard size={20}/> Visão Geral</Link>
          <Link to="/chamada" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 10, color: 'var(--ouro)' }}><ClipboardCheck size={20}/> Lista de Chamada</Link>
          {isAdmin && (
            <>
              <Link to="/atletas" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 10 }}><Users size={20}/> Atletas</Link>
              <Link to="/equipe" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 10 }}><UserCog size={20}/> Treinadores</Link>
              <Link to="/avisos" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 10 }}><Megaphone size={20}/> Mural de Avisos</Link>
            </>
          )}
        </nav>
        <button onClick={handleLogout} className="btn outline" style={{ marginTop: 'auto', width: '100%', position: 'absolute', bottom: 20, maxWidth: 210, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          <LogOut size={18} /> Sair
        </button>
      </aside>
      <main style={{ flex: 1, padding: 40, overflowY: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
}

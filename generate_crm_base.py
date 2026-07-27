import os

# 1. Login.jsx
login_jsx = """import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError('Credenciais invA¡lidas.');
    }
  };

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      alignItems: 'center',
      justifyContent: 'center',
      background: "linear-gradient(rgba(10,10,12,0.85), rgba(10,10,12,0.6)), url('/alfaacademy/assets/img/alfa_mosaic_bg.png') center/cover no-repeat fixed"
    }}>
      <div className="card" style={{ maxWidth: 400, width: '100%', backdropFilter: 'blur(12px)', background: 'rgba(18,18,20,0.65)' }}>
        <h2 style={{ textAlign: 'center', color: 'var(--ouro)', marginBottom: 20 }}>ALFA ACADEMY</h2>
        {error && <div style={{ color: '#ef4444', marginBottom: 10, textAlign: 'center' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <label>UsuA¡rio</label>
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} required />
          <label>Senha</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          <button type="submit" className="btn" style={{ width: '100%', marginTop: 10 }}>Entrar</button>
        </form>
      </div>
    </div>
  );
}
"""
with open("crm/src/pages/Login.jsx", "w", encoding="utf-8") as f: f.write(login_jsx.replace("A¡", "á"))

# 2. Layout.jsx
layout_jsx = """import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, Users, UserCog, ClipboardCheck, LogOut } from 'lucide-react';

export default function Layout() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdmin = user?.perfil === 'Administrador' || user?.perfil === 'admin';

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
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{ width: 260, background: 'var(--painel)', borderRight: '1px solid var(--linha)', padding: 20, display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ color: 'var(--ouro)', marginBottom: 40, textAlign: 'center', fontSize: 22 }}>Alfa Academy</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <NavLink to="/" icon={LayoutDashboard}>VisA£o Geral</NavLink>
          <NavLink to="/chamada" icon={ClipboardCheck}>Lista de Chamada</NavLink>
          {isAdmin && (
            <>
              <NavLink to="/atletas" icon={Users}>Atletas</NavLink>
              <NavLink to="/equipe" icon={UserCog}>Treinadores</NavLink>
            </>
          )}
        </nav>
        <button onClick={handleLogout} className="btn outline" style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          <LogOut size={18} /> Sair
        </button>
      </aside>
      <main style={{ flex: 1, padding: 40, overflowY: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
}
"""
with open("crm/src/components/Layout.jsx", "w", encoding="utf-8") as f: f.write(layout_jsx.replace("A£", "ã"))

# 3. Overview.jsx
overview_jsx = """import { useState, useEffect } from 'react';
import api from '../api';
import { Users, Activity, UserCog } from 'lucide-react';

export default function Overview() {
  const [metrics, setMetrics] = useState({ total_atletas: 0, lesionados: 0, total_treinadores: 0 });

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await api.get('/api/admin/metricas');
        setMetrics(res.data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchMetrics();
  }, []);

  const Card = ({ title, value, icon: Icon, color }) => (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
      <div style={{ background: color, padding: 16, borderRadius: '50%', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={28} />
      </div>
      <div>
        <p style={{ color: 'var(--cinza)', fontSize: 14, marginBottom: 5 }}>{title}</p>
        <h2 style={{ fontSize: 32 }}>{value}</h2>
      </div>
    </div>
  );

  return (
    <div>
      <h1 style={{ color: 'var(--ouro)', marginBottom: 30 }}>VisA£o Geral</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
        <Card title="Total de Atletas" value={metrics.total_atletas} icon={Users} color="#3b82f6" />
        <Card title="Atletas no DM" value={metrics.lesionados} icon={Activity} color="#ef4444" />
        <Card title="ComissA£o TAcnica" value={metrics.total_treinadores} icon={UserCog} color="#eab308" />
      </div>
    </div>
  );
}
"""
with open("crm/src/pages/Overview.jsx", "w", encoding="utf-8") as f: f.write(overview_jsx.replace("A£", "ã").replace("AA", "é"))

# 4. App.jsx (remove avisos)
with open("crm/src/App.jsx", "r", encoding="utf-8") as f: app_content = f.read()
app_content = "\n".join([line for line in app_content.split('\n') if "avisos" not in line.lower() and "notices" not in line.lower()])
with open("crm/src/App.jsx", "w", encoding="utf-8") as f: f.write(app_content)


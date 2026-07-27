layout_jsx = """import { Outlet, Link, useNavigate } from 'react-router-dom';
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
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 10 }}><LayoutDashboard size={20}/> VisA£o Geral</Link>
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
"""
with open("crm/src/components/Layout.jsx", "w", encoding="utf-8") as f: f.write(layout_jsx.replace("A£", "ã"))

attendance_jsx = """import { useState, useEffect } from 'react';
import api from '../api';
import { Check, X, UserMinus, Activity } from 'lucide-react';

export default function Attendance() {
  const [atletas, setAtletas] = useState([]);
  const [categoria, setCategoria] = useState('Sub-15');

  useEffect(() => {
    carregarAtletas();
  }, [categoria]);

  const carregarAtletas = async () => {
    try {
      const res = await api.get('/api/admin/atletas');
      const filtrados = res.data.filter(a => a.categoria === categoria);
      setAtletas(filtrados.map(a => ({ ...a, presencaStatus: null })));
    } catch (e) {
      console.error(e);
    }
  };

  const handleStatus = (id, status) => {
    setAtletas(atletas.map(a => a.id === id ? { ...a, presencaStatus: status } : a));
  };

  const submitChamada = async () => {
    // Aqui seria enviada a lista para a API
    alert('Chamada registrada com sucesso para o ' + categoria + '!');
  };

  return (
    <div>
      <h1 style={{ color: 'var(--ouro)' }}>Lista de Chamada Oficial</h1>
      <p style={{ color: 'var(--cinza)', marginBottom: 30 }}>Marque a frequAancia no prA³prio campo pelo celular.</p>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        {['Sub-11', 'Sub-13', 'Sub-15', 'Sub-17', 'Sub-20'].map(cat => (
          <button key={cat} onClick={() => setCategoria(cat)} className={`btn ${categoria !== cat ? 'outline' : ''}`} style={{ padding: '8px 16px' }}>
            {cat}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gap: 15 }}>
        {atletas.length === 0 ? <p>Nenhum atleta nesta categoria.</p> : null}
        {atletas.map(a => (
          <div key={a.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px' }}>
            <div>
              <strong style={{ display: 'block', fontSize: 18 }}>{a.nome}</strong>
              <span style={{ color: 'var(--cinza)', fontSize: 14 }}>PosiA§A£o: {a.posicao}</span>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => handleStatus(a.id, 'Presente')} style={{ padding: 10, borderRadius: 8, background: a.presencaStatus === 'Presente' ? '#22c55e' : 'rgba(255,255,255,0.1)', color: '#fff' }}><Check size={20}/></button>
              <button onClick={() => handleStatus(a.id, 'Faltou')} style={{ padding: 10, borderRadius: 8, background: a.presencaStatus === 'Faltou' ? '#ef4444' : 'rgba(255,255,255,0.1)', color: '#fff' }}><X size={20}/></button>
              <button onClick={() => handleStatus(a.id, 'Justificado')} title="Falta Justificada" style={{ padding: 10, borderRadius: 8, background: a.presencaStatus === 'Justificado' ? '#eab308' : 'rgba(255,255,255,0.1)', color: '#fff' }}><UserMinus size={20}/></button>
              <button onClick={() => handleStatus(a.id, 'Lesionado')} title="Lesionado/DM" style={{ padding: 10, borderRadius: 8, background: a.presencaStatus === 'Lesionado' ? '#a855f7' : 'rgba(255,255,255,0.1)', color: '#fff' }}><Activity size={20}/></button>
            </div>
          </div>
        ))}
      </div>

      <button onClick={submitChamada} className="btn" style={{ marginTop: 30, width: '100%', padding: 20, fontSize: 18 }}>Confirmar PresenA§as do {categoria}</button>
    </div>
  );
}
"""
with open("crm/src/pages/Attendance.jsx", "w", encoding="utf-8") as f: 
    f.write(attendance_jsx.replace("A£", "ã").replace("A§", "ç").replace("A³", "ó").replace("Aª", "ê"))

overview_jsx = """export default function Overview() {
  return <div><h1 style={{ color: 'var(--ouro)' }}>VisA£o Geral</h1><p>MAtricas em desenvolvimento.</p></div>;
}"""
with open("crm/src/pages/Overview.jsx", "w", encoding="utf-8") as f: f.write(overview_jsx.replace("A£", "ã").replace("A©", "é"))

stub_jsx = """export default function Stub({ title }) {
  return <div><h1 style={{ color: 'var(--ouro)' }}>{title}</h1><p>MAtulo em construA§A£o no novo React CRM.</p></div>;
}"""
with open("crm/src/pages/Athletes.jsx", "w", encoding="utf-8") as f: f.write(stub_jsx.replace("Stub", "Athletes").replace("{title}", "Gestão de Atletas"))
with open("crm/src/pages/Staff.jsx", "w", encoding="utf-8") as f: f.write(stub_jsx.replace("Stub", "Staff").replace("{title}", "Comissão Técnica"))
with open("crm/src/pages/Notices.jsx", "w", encoding="utf-8") as f: f.write(stub_jsx.replace("Stub", "Notices").replace("{title}", "Mural de Avisos"))

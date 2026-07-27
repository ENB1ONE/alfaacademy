# Attendance.jsx
attendance_jsx = """import { useState, useEffect } from 'react';
import api from '../api';
import { Save } from 'lucide-react';

export default function Attendance() {
  const [categoria, setCategoria] = useState('Sub-15');
  const [atletas, setAtletas] = useState([]);
  const [presencas, setPresencas] = useState({});

  const loadAtletas = async () => {
    try {
      const res = await api.get('/api/admin/atletas');
      const list = Array.isArray(res.data) ? res.data : (res.data?.atletas || []);
      const filtrados = list.filter(a => a.categoria === categoria);
      setAtletas(filtrados);
      
      const obj = {};
      filtrados.forEach(a => { obj[a.id] = true; });
      setPresencas(obj);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => { loadAtletas(); }, [categoria]);

  const handleSave = async () => {
    try {
      const payload = atletas.map(a => ({
        atleta_id: a.id,
        presente: presencas[a.id]
      }));
      await api.post('/api/admin/chamadas', { categoria, presencas: payload });
      alert('Lista de chamada salva com sucesso!');
    } catch (e) {
      alert('Erro ao salvar lista de chamada. Verifique se o servidor suporta esta funA§A£o.');
    }
  };

  const btnStyle = (cat) => ({
    padding: '8px 16px', borderRadius: 8, background: categoria === cat ? 'var(--ouro)' : 'transparent',
    color: categoria === cat ? '#000' : 'var(--ouro)', border: '1px solid var(--ouro)', cursor: 'pointer'
  });

  return (
    <div>
      <h1 style={{ color: 'var(--ouro)', marginBottom: 10 }}>Lista de Chamada Oficial</h1>
      <p style={{ color: 'var(--cinza)', marginBottom: 20 }}>Selecione a categoria para realizar a chamada do dia.</p>
      
      <div style={{ display: 'flex', gap: 10, marginBottom: 30 }}>
        {['Sub-11', 'Sub-13', 'Sub-15', 'Sub-17', 'Sub-20'].map(cat => (
          <button key={cat} onClick={() => setCategoria(cat)} style={btnStyle(cat)}>{cat}</button>
        ))}
      </div>

      <div className="card" style={{ padding: '0 20px 20px 20px' }}>
        {atletas.length === 0 ? (
          <p style={{ padding: 20, textAlign: 'center', color: 'var(--cinza)' }}>Nenhum atleta nesta categoria.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20 }}>
            <thead>
              <tr><th style={{ textAlign: 'left', padding: 15, borderBottom: '1px solid var(--linha)', color: 'var(--cinza)' }}>Atleta</th><th style={{ textAlign: 'center', padding: 15, borderBottom: '1px solid var(--linha)', color: 'var(--cinza)' }}>Presente?</th></tr>
            </thead>
            <tbody>
              {atletas.map(a => (
                <tr key={a.id}>
                  <td style={{ padding: 15, borderBottom: '1px solid var(--linha)' }}><strong>{a.nome}</strong></td>
                  <td style={{ padding: 15, borderBottom: '1px solid var(--linha)', textAlign: 'center' }}>
                    <input type="checkbox" checked={presencas[a.id]} onChange={e => setPresencas({...presencas, [a.id]: e.target.checked})} style={{ width: 24, height: 24, accentColor: 'var(--ouro)' }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {atletas.length > 0 && (
          <button onClick={handleSave} className="btn" style={{ width: '100%', marginTop: 20, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
            <Save size={20} /> Salvar Chamada do {categoria}
          </button>
        )}
      </div>
    </div>
  );
}
"""
with open("crm/src/pages/Attendance.jsx", "w", encoding="utf-8") as f: f.write(attendance_jsx.replace("A§", "ç").replace("A£", "ã"))

# Overview.jsx
overview_jsx = """import { useState, useEffect } from 'react';
import api from '../api';
import { Users, Activity, UserCog } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';

export default function Overview() {
  const [metrics, setMetrics] = useState({ total_atletas: 0, lesionados: 0, total_treinadores: 0 });
  const [dist, setDist] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/api/admin/metricas');
        setMetrics({
          total_atletas: res.data.metricas?.total_atletas || 0,
          lesionados: res.data.metricas?.total_dm || 0,
          total_treinadores: res.data.metricas?.total_treinadores || 0
        });

        // Fetch atletas to build the category distribution chart
        const r2 = await api.get('/api/admin/atletas');
        const list = Array.isArray(r2.data) ? r2.data : (r2.data?.atletas || []);
        
        const counts = {};
        list.forEach(a => { counts[a.categoria] = (counts[a.categoria] || 0) + 1; });
        const chartData = Object.keys(counts).map(k => ({ name: k, value: counts[k] }));
        setDist(chartData);

      } catch (e) {
        console.error(e);
      }
    };
    fetchData();
  }, []);

  const COLORS = ['#3b82f6', '#eab308', '#ef4444', '#10b981', '#8b5cf6'];

  const Card = ({ title, value, icon: Icon, color, link }) => (
    <div className="card" onClick={() => navigate(link)} style={{ display: 'flex', alignItems: 'center', gap: 20, cursor: 'pointer', transition: '0.2s' }}>
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
      <h1 style={{ color: 'var(--ouro)', marginBottom: 30 }}>Dashboard Executivo</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20, marginBottom: 30 }}>
        <Card title="Total de Atletas" value={metrics.total_atletas} icon={Users} color="#3b82f6" link="/atletas" />
        <Card title="Atletas no DM" value={metrics.lesionados} icon={Activity} color="#ef4444" link="/atletas" />
        <Card title="ComissA£o TAcnica" value={metrics.total_treinadores} icon={UserCog} color="#eab308" link="/equipe" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div className="card">
          <h3 style={{ marginBottom: 20 }}>DistribuiA§A£o por Categoria</h3>
          <div style={{ height: 300 }}>
            {dist.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={dist} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                    {dist.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <RechartsTooltip contentStyle={{ background: '#1e1e24', border: 'none', borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : <p style={{ textAlign: 'center', color: 'var(--cinza)', marginTop: 100 }}>Carregando dados...</p>}
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: 20 }}>Atletas por Categoria</h3>
          <div style={{ height: 300 }}>
            {dist.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dist}>
                  <XAxis dataKey="name" stroke="var(--cinza)" />
                  <YAxis stroke="var(--cinza)" />
                  <RechartsTooltip contentStyle={{ background: '#1e1e24', border: 'none', borderRadius: 8 }} />
                  <Bar dataKey="value" fill="var(--ouro)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : <p style={{ textAlign: 'center', color: 'var(--cinza)', marginTop: 100 }}>Carregando dados...</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
"""
with open("crm/src/pages/Overview.jsx", "w", encoding="utf-8") as f: f.write(overview_jsx.replace("A£", "ã").replace("TAcnica", "Técnica").replace("A§", "ç"))


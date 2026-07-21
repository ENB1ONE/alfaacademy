import { useState, useEffect } from 'react';
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
          total_atletas: res.data.total_atletas || 0,
          lesionados: res.data.departamento_medico || 0,
          total_treinadores: res.data.equipe_tecnica || 0
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
        <Card title="Comissão Técnica" value={metrics.total_treinadores} icon={UserCog} color="#eab308" link="/equipe" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div className="card">
          <h3 style={{ marginBottom: 20 }}>Distribuição por Categoria</h3>
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

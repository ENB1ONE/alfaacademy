import { useState, useEffect } from 'react';
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
      <h1 style={{ color: 'var(--ouro)', marginBottom: 30 }}>Visão Geral</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
        <Card title="Total de Atletas" value={metrics.total_atletas} icon={Users} color="#3b82f6" />
        <Card title="Atletas no DM" value={metrics.lesionados} icon={Activity} color="#ef4444" />
        <Card title="Comissão TAcnica" value={metrics.total_treinadores} icon={UserCog} color="#eab308" />
      </div>
    </div>
  );
}

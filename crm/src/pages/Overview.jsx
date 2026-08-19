import { useState, useEffect } from 'react';
import api from '../api';
import { Users, Activity, UserCog, Trophy, X } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';

export default function Overview() {
  const [proximosJogos, setProximosJogos] = useState([]);
  const [metrics, setMetrics] = useState({ total_atletas: 0, lesionados: 0, total_treinadores: 0, top_faltosos: [] });
  const [dist, setDist] = useState([]);
  const [selectedJogo, setSelectedJogo] = useState(null);
  const [convocados, setConvocados] = useState([]);
  const [loadingConvocados, setLoadingConvocados] = useState(false);
  const [showConvocacaoModal, setShowConvocacaoModal] = useState(false);

  const openJogoModal = async (j) => {
    setSelectedJogo(j);
    setShowConvocacaoModal(true);
    setLoadingConvocados(true);
    setConvocados([]);
    try {
        const res = await api.post('/api/admin/jogos/multi-convocados', { treino_ids: j.treino_ids });
        const list = res.data.filter(a => a.convocado);
        setConvocados(list);
    } catch(e) {
        console.error(e);
    } finally {
        setLoadingConvocados(false);
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        
        const resProximos = await api.get('/api/admin/eventos/proximos');
        setProximosJogos(resProximos.data);
        const res = await api.get('/api/admin/metricas');
        setMetrics({
          total_atletas: res.data.total_atletas || 0,
          lesionados: res.data.departamento_medico || 0,
          total_treinadores: res.data.equipe_tecnica || 0,
          top_faltosos: res.data.top_faltosos || []
        });

        // Fetch atletas to build the category distribution chart
        const r2 = await api.get('/api/admin/atletas');
        const list = Array.isArray(r2.data) ? r2.data : (r2.data?.atletas || []);
        
        const counts = {};
        list.forEach(a => { const cat = a.categoria_nome || a.categoria || 'Sem Categoria'; counts[cat] = (counts[cat] || 0) + 1; });
        const chartData = Object.keys(counts).map(k => ({ name: k, value: counts[k] }));
        setDist(chartData);

      } catch (e) {
        console.error(e);
      }
    };
    fetchData();
  }, []);

  const COLORS = ['#F8C146', '#C99520', '#3b82f6', '#10b981', '#ef4444']; // More premium chart colors matching the theme

  const Card = ({ title, value, icon: Icon, color, link }) => (
    <div className="card interactive" onClick={() => navigate(link)} style={{ display: 'flex', alignItems: 'center', gap: 20, cursor: 'pointer' }}>
      <div style={{ background: `linear-gradient(135deg, ${color} 0%, rgba(0,0,0,0.5) 150%)`, padding: 16, borderRadius: '50%', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 15px ${color}40` }}>
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

      <div className="card" style={{ marginBottom: 30, padding: 20 }}>
        <h3 style={{ color: 'var(--ouro)', margin: '0 0 15px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Trophy size={20} /> Próximos Jogos (10 dias)
        </h3>
        {proximosJogos.length === 0 ? (
            <p style={{ margin: 0, color: 'var(--cinza)' }}>Nenhum jogo agendado para os próximos dias.</p>
        ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 15 }}>
                {Object.values(proximosJogos.reduce((acc, j) => {
    const key = j.data_br + '_' + j.titulo;
    if (!acc[key]) {
        acc[key] = { ...j, categorias_nomes: [j.categoria_nome].filter(Boolean), treino_ids: [j.id] };
    } else {
        if (j.categoria_nome && !acc[key].categorias_nomes.includes(j.categoria_nome)) {
            acc[key].categorias_nomes.push(j.categoria_nome);
        }
        if (!acc[key].treino_ids) acc[key].treino_ids = [acc[key].id];
        if (!acc[key].treino_ids.includes(j.id)) {
            acc[key].treino_ids.push(j.id);
        }
    }
    return acc;
}, {})).map((j, i) => (
    <div key={i} className="card interactive" onClick={() => openJogoModal(j)} style={{ padding: 15, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--linha)', cursor: 'pointer' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
            <span style={{ color: '#EF4444', fontWeight: 'bold' }}>{j.data_br}</span>
            {j.horario && <span style={{ color: 'var(--cinza)', fontSize: 12 }}>{j.horario}</span>}
        </div>
        <div style={{ color: 'var(--texto)', fontSize: 16 }}>{j.titulo}</div>
        {j.campeonato && <div style={{ color: 'var(--ouro)', fontSize: 13, marginTop: 4, fontWeight: 500 }}>{j.campeonato}</div>}
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginTop: 10 }}>
          {j.categorias_nomes.map((cat, idx) => (
              <span key={idx} style={{ background: 'rgba(248,193,70,0.2)', border: '1px solid var(--ouro)', color: 'var(--ouro)', padding: '2px 8px', borderRadius: 12, fontSize: 11, fontWeight: 'bold' }}>
                  {cat}
              </span>
          ))}
        </div>
    </div>
))}
            </div>
        )}
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

        <div className="card" style={{ cursor: 'pointer', transition: '0.2s' }} onClick={() => navigate('/frequencia')} title="Ver Relatório Completo">
          <h3 style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between' }}>Top Atletas Faltosos <span style={{fontSize: 12, color: 'var(--ouro)', fontWeight: 'normal'}}>Ver Todos &rarr;</span></h3>
          <div style={{ height: 300 }}>
            {metrics.top_faltosos.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics.top_faltosos} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <XAxis type="number" stroke="var(--cinza)" />
                  <YAxis dataKey="nome" type="category" stroke="var(--cinza)" width={100} />
                  <RechartsTooltip contentStyle={{ background: '#1e1e24', border: 'none', borderRadius: 8 }} />
                  <Bar dataKey="faltas" fill="#EF4444" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : <p style={{ textAlign: 'center', color: 'var(--cinza)', marginTop: 100 }}>Nenhum dado de faltas encontrado.</p>}
          </div>
        </div>

      {/* Modal Detalhes do Jogo */}
      {showConvocacaoModal && selectedJogo && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
          <div className="card" style={{ width: '100%', maxWidth: 700, padding: '20px', position: 'relative', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
            <button onClick={() => setShowConvocacaoModal(false)} style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', color: 'var(--cinza)', cursor: 'pointer' }}>
              <X size={24} />
            </button>
            <h2 style={{ margin: '0 0 10px 0', color: 'var(--ouro)' }}>{selectedJogo.titulo}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20, fontSize: 14 }}>
              <div><strong style={{ color: 'var(--cinza)' }}>Data:</strong> <span style={{ color: '#EF4444', fontWeight: 'bold' }}>{selectedJogo.data_br}</span></div>
              <div><strong style={{ color: 'var(--cinza)' }}>Hor&aacute;rio:</strong> {selectedJogo.horario || '--:--'}</div>
              <div><strong style={{ color: 'var(--cinza)' }}>Campeonato/Liga:</strong> {selectedJogo.campeonato || 'N/A'}</div>
              <div style={{ gridColumn: 'span 2' }}><strong style={{ color: 'var(--cinza)' }}>Observa&ccedil;&otilde;es:</strong> {selectedJogo.observacao || 'Nenhuma'}</div>
            </div>

            <div style={{ borderBottom: '1px solid var(--linha)', paddingBottom: 10, marginBottom: 15, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0 }}>Lista de Convocados</h3>
                {isAdmin && (
                    <button onClick={() => navigate('/jogos')} className="btn outline" style={{ padding: '4px 10px', fontSize: 12 }}>
                        Gerenciar Convocações
                    </button>
                )}
            </div>
            
            {loadingConvocados ? (
                <p style={{ color: 'var(--cinza)', textAlign: 'center' }}>Carregando convocados...</p>
            ) : convocados.length === 0 ? (
                <p style={{ color: 'var(--cinza)', textAlign: 'center' }}>Nenhum atleta convocado para este jogo ainda.</p>
            ) : (
                <div style={{ overflowY: 'auto', flex: 1, paddingRight: 5 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
                        {convocados.map(a => (
                            <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 10, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--linha)', borderRadius: 8 }}>
                                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--ouro)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 }}>
                                    {a.nome.charAt(0)}
                                </div>
                                <div style={{ overflow: 'hidden' }}>
                                    <div style={{ fontSize: 14, fontWeight: 'bold', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{a.nome}</div>
                                    <div style={{ fontSize: 12, color: 'var(--cinza)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{a.categoria_nome || 'Categoria'} - {a.posicao || 'Posi&ccedil;&atilde;o'}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
          </div>
        </div>
      )}
      </div>
    </div>
  );
}


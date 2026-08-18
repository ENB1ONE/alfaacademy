import { useState, useEffect, useContext } from 'react';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import { Search, Filter, ArrowDownUp } from 'lucide-react';

export default function AttendanceReport() {
  const { user } = useContext(AuthContext);
  const isAdmin = ['Administrador', 'admin', 'Admin'].includes(user?.perfil);

  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [categorias, setCategorias] = useState([]);
  const [treinadores, setTreinadores] = useState([]);
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroTreinador, setFiltroTreinador] = useState('');
  const [busca, setBusca] = useState('');
  const [ordenacao, setOrdenacao] = useState('alfabetica');

  const loadCategorias = async () => {
    try {
      const res = await api.get('/api/admin/categorias');
      setCategorias(res.data.categorias || res.data);
    } catch (e) { console.error(e); }
  };

  const loadTreinadores = async () => {
    if (!isAdmin) return;
    try {
      const res = await api.get('/api/admin/treinadores');
      setTreinadores(res.data.treinadores || []);
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await api.get('/api/admin/frequencia-geral');
        setReport(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
    loadCategorias();
    loadTreinadores();
  }, []);

  const getPercentage = (presencas, eventos) => {
      if (eventos == 0) return '0%';
      return Math.round((presencas / eventos) * 100) + '%';
  };

  const getPercentageVal = (presencas, eventos) => {
      if (eventos == 0) return 0;
      return (presencas / eventos) * 100;
  };

  const getColor = (presencas, eventos) => {
      if (eventos == 0) return 'var(--cinza)';
      const p = presencas / eventos;
      if (p < 0.5) return '#EF4444'; // Red (Warning)
      if (p < 0.75) return '#EAB308'; // Yellow
      return '#10B981'; // Green
  };

  let filteredReport = report.filter(r => {
    let matchCat = true;
    let matchTreinador = true;
    let matchBusca = true;

    if (filtroCategoria) {
      const cat = categorias.find(c => String(c.id) === String(filtroCategoria));
      if (cat) {
        const rName = String(r.categoria_nome || r.categoria || "").trim().toLowerCase();
        const cName = String(cat.nome || "").trim().toLowerCase();
        matchCat = (rName === cName) || (String(r.categoria_id) === String(filtroCategoria));
      } else {
        matchCat = String(r.categoria_id) === String(filtroCategoria);
      }
    }

    if (filtroTreinador && treinadores.length > 0) {
      const t = treinadores.find(tr => String(tr.id) === String(filtroTreinador));
      if (t && t.categorias) {
        matchTreinador = t.categorias.some(c => String(c.id) === String(r.categoria_id));
      } else {
        matchTreinador = false;
      }
    }

    if (busca) {
      matchBusca = r.nome?.toLowerCase().includes(busca.toLowerCase());
    }

    return matchCat && matchTreinador && matchBusca;
  });

  filteredReport.sort((a, b) => {
      if (ordenacao === 'alfabetica') return (a.nome || '').localeCompare(b.nome || '');
      if (ordenacao === 'mais_convocados') return (b.total_convocacoes || 0) - (a.total_convocacoes || 0);
      if (ordenacao === 'mais_presentes') return (b.total_presencas || 0) - (a.total_presencas || 0);
      if (ordenacao === 'mais_faltosos') return (b.total_faltas || 0) - (a.total_faltas || 0);
      if (ordenacao === 'assiduidade_desc') return getPercentageVal(b.total_presencas, b.total_eventos) - getPercentageVal(a.total_presencas, a.total_eventos);
      if (ordenacao === 'assiduidade_asc') return getPercentageVal(a.total_presencas, a.total_eventos) - getPercentageVal(b.total_presencas, b.total_eventos);
      return 0;
  });

  return (
    <div>
      <h1 style={{ color: 'var(--ouro)', marginBottom: 10 }}>Relatório de Frequência Geral</h1>
      <p style={{ color: 'var(--cinza)', marginBottom: 20 }}>Visão completa de assiduidade de todos os atletas do clube.</p>

      <div className="card" style={{ padding: 20, marginBottom: 30 }}>
        <h4 style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 15, color: 'var(--ouro)' }}><Filter size={18} /> Filtros e Ordenação</h4>
        <div style={{ display: 'grid', gridTemplateColumns: isAdmin ? 'repeat(auto-fill, minmax(200px, 1fr))' : 'repeat(auto-fill, minmax(200px, 1fr))', gap: 15 }}>
          <div>
            <label style={{ fontSize: 12, color: 'var(--cinza)' }}>Buscar por Nome</label>
            <div style={{ position: 'relative' }}>
               <Search size={16} style={{ position: 'absolute', top: 12, left: 10, color: 'var(--cinza)' }} />
               <input type="text" placeholder="Nome do atleta..." value={busca} onChange={e => setBusca(e.target.value)} style={{ marginTop: 0, paddingLeft: 35, marginBottom: 0 }} />
            </div>
          </div>
          <div>
            <label style={{ fontSize: 12, color: 'var(--cinza)' }}>Filtrar Categoria</label>
            <select value={filtroCategoria} onChange={e => setFiltroCategoria(e.target.value)} style={{ marginTop: 0, marginBottom: 0 }}>
              <option value="">Todas as Categorias</option>
              {categorias.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
          </div>
          {isAdmin && (
            <div>
              <label style={{ fontSize: 12, color: 'var(--cinza)' }}>Filtrar Professor</label>
              <select value={filtroTreinador} onChange={e => setFiltroTreinador(e.target.value)} style={{ marginTop: 0, marginBottom: 0 }}>
                <option value="">Todos os Professores</option>
                {treinadores.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
              </select>
            </div>
          )}
          <div>
            <label style={{ fontSize: 12, color: 'var(--cinza)', display: 'flex', alignItems: 'center', gap: 5 }}><ArrowDownUp size={12}/> Ordenar Por</label>
            <select value={ordenacao} onChange={e => setOrdenacao(e.target.value)} style={{ marginTop: 0, marginBottom: 0 }}>
              <option value="alfabetica">Ordem Alfabética</option>
              <option value="mais_convocados">Mais Convocados</option>
              <option value="mais_presentes">Mais Presentes</option>
              <option value="mais_faltosos">Mais Faltosos</option>
              <option value="assiduidade_desc">Maior Assiduidade (%)</option>
              <option value="assiduidade_asc">Menor Assiduidade (%)</option>
            </select>
          </div>
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {loading ? (
            <p style={{ padding: 20, textAlign: 'center', color: 'var(--cinza)', gridColumn: '1 / -1' }}>Carregando dados...</p>
        ) : filteredReport.length === 0 ? (
          <p style={{ padding: 20, textAlign: 'center', color: 'var(--cinza)', gridColumn: '1 / -1' }}>Nenhum dado encontrado.</p>
        ) : (
          filteredReport.map(r => (
            <div className="card" key={r.id} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ margin: 0, color: 'var(--ouro)', fontSize: '1.2rem' }}>{r.nome}</h3>
                  <span style={{ fontSize: '0.85rem', color: 'var(--cinza)' }}>{r.categoria_nome || 'Sem Categoria'}</span>
                </div>
                <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: 20, color: getColor(r.total_presencas, r.total_eventos), fontWeight: 'bold', fontSize: '1.1rem' }}>
                    {getPercentage(r.total_presencas, r.total_eventos)}
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.9rem', background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '10px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ color: 'var(--cinza)', fontSize: '0.8rem' }}>Chamadas</span>
                  <strong style={{ fontSize: '1.1rem' }}>{r.total_eventos}</strong>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ color: 'var(--cinza)', fontSize: '0.8rem' }}>Convocado</span>
                  <strong style={{ fontSize: '1.1rem', color: 'var(--ouro)' }}>{r.total_convocacoes || 0}</strong>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderTop: '1px solid var(--linha)', paddingTop: '10px' }}>
                  <span style={{ color: 'var(--cinza)', fontSize: '0.8rem' }}>Presenças</span>
                  <strong style={{ fontSize: '1.1rem', color: '#10B981' }}>{r.total_presencas}</strong>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderTop: '1px solid var(--linha)', paddingTop: '10px' }}>
                  <span style={{ color: 'var(--cinza)', fontSize: '0.8rem' }}>Faltas</span>
                  <strong style={{ fontSize: '1.1rem', color: '#EF4444' }}>{r.total_faltas}</strong>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

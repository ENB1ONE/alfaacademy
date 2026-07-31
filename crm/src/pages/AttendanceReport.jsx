import { useState, useEffect, useContext } from 'react';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import { Search, Filter } from 'lucide-react';

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

  const getColor = (presencas, eventos) => {
      if (eventos == 0) return 'var(--cinza)';
      const p = presencas / eventos;
      if (p < 0.5) return '#EF4444'; // Red (Warning)
      if (p < 0.75) return '#EAB308'; // Yellow
      return '#10B981'; // Green
  };

  const filteredReport = report.filter(r => {
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

  return (
    <div>
      <h1 style={{ color: 'var(--ouro)', marginBottom: 10 }}>Relatório de Frequência Geral</h1>
      <p style={{ color: 'var(--cinza)', marginBottom: 20 }}>Visão completa de assiduidade de todos os atletas do clube.</p>

      <div className="card" style={{ padding: 20, marginBottom: 30 }}>
        <h4 style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 15, color: 'var(--ouro)' }}><Filter size={18} /> Filtros de Pesquisa</h4>
        <div style={{ display: 'grid', gridTemplateColumns: isAdmin ? '1fr 1fr 1fr' : '1fr 1fr', gap: 15 }}>
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
        </div>
      </div>
      
      <div className="card table-container" style={{ padding: '0 20px 20px 20px' }}>
        {loading ? (
            <p style={{ padding: 20, textAlign: 'center', color: 'var(--cinza)' }}>Carregando dados...</p>
        ) : filteredReport.length === 0 ? (
          <p style={{ padding: 20, textAlign: 'center', color: 'var(--cinza)' }}>Nenhum dado encontrado.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20, minWidth: 600 }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: 15, borderBottom: '1px solid var(--linha)', color: 'var(--cinza)' }}>Atleta</th>
                <th style={{ textAlign: 'left', padding: 15, borderBottom: '1px solid var(--linha)', color: 'var(--cinza)' }}>Categoria</th>
                <th style={{ textAlign: 'center', padding: 15, borderBottom: '1px solid var(--linha)', color: 'var(--cinza)' }}>Chamadas</th>
                <th style={{ textAlign: 'center', padding: 15, borderBottom: '1px solid var(--linha)', color: 'var(--cinza)' }}>Presenças</th>
                <th style={{ textAlign: 'center', padding: 15, borderBottom: '1px solid var(--linha)', color: 'var(--cinza)' }}>Faltas</th>
                <th style={{ textAlign: 'center', padding: 15, borderBottom: '1px solid var(--linha)', color: 'var(--cinza)' }}>Assiduidade</th>
              </tr>
            </thead>
            <tbody>
              {filteredReport.map(r => (
                <tr key={r.id}>
                  <td style={{ padding: 15, borderBottom: '1px solid var(--linha)' }}><strong>{r.nome}</strong></td>
                  <td style={{ padding: 15, borderBottom: '1px solid var(--linha)', color: 'var(--cinza)' }}>{r.categoria_nome || 'S/ Categoria'}</td>
                  <td style={{ padding: 15, borderBottom: '1px solid var(--linha)', textAlign: 'center' }}>{r.total_eventos}</td>
                  <td style={{ padding: 15, borderBottom: '1px solid var(--linha)', textAlign: 'center', color: '#10B981' }}>{r.total_presencas}</td>
                  <td style={{ padding: 15, borderBottom: '1px solid var(--linha)', textAlign: 'center', color: '#EF4444' }}>{r.total_faltas}</td>
                  <td style={{ padding: 15, borderBottom: '1px solid var(--linha)', textAlign: 'center' }}>
                      <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.05)', padding: '4px 12px', borderRadius: 20, color: getColor(r.total_presencas, r.total_eventos), fontWeight: 'bold' }}>
                          {getPercentage(r.total_presencas, r.total_eventos)}
                      </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

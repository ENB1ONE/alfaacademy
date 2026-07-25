import { useState, useEffect } from 'react';
import api from '../api';
import { Activity } from 'lucide-react';

export default function AttendanceReport() {
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div>
      <h1 style={{ color: 'var(--ouro)', marginBottom: 10 }}>Relatório de Frequência Geral</h1>
      <p style={{ color: 'var(--cinza)', marginBottom: 20 }}>Visão completa de assiduidade de todos os atletas do clube.</p>
      
      <div className="card" style={{ padding: '0 20px 20px 20px', overflowX: 'auto' }}>
        {loading ? (
            <p style={{ padding: 20, textAlign: 'center', color: 'var(--cinza)' }}>Carregando dados...</p>
        ) : report.length === 0 ? (
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
              {report.map(r => (
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

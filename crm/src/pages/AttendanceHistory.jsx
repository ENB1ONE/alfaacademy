import React, { useState, useEffect } from 'react';
import api from '../api';
import { CalendarDays, Users, Trophy, ChevronRight, X } from 'lucide-react';

export default function AttendanceHistory() {
  const [activeTab, setActiveTab] = useState('ranking');
  const [ranking, setRanking] = useState([]);
  const [treinos, setTreinos] = useState([]);
  const [modalTreino, setModalTreino] = useState(null);
  const [presencasDetail, setPresencasDetail] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const resRank = await api.get('/api/admin/historico-chamadas');
      setRanking(resRank.data.ranking || []);

      const resTreinos = await api.get('/api/admin/treinos');
      setTreinos(resTreinos.data.treinos || []);
    } catch (e) {
      console.error(e);
    }
  };

  const openTreino = async (treino) => {
    try {
      const res = await api.get(`/api/admin/treinos/${treino.id}/presencas`);
      setPresencasDetail(res.data.presencas || []);
      setModalTreino(treino);
    } catch (e) {
      alert("Erro ao carregar lista de presenças");
    }
  };

  const getFrequenciaColor = (perc) => {
    if (perc >= 80) return '#10b981'; // Green
    if (perc >= 50) return '#eab308'; // Yellow
    return '#ef4444'; // Red
  };

  return (
    <div style={{ color: 'var(--texto)' }}>
      <h2 style={{ color: 'var(--ouro)', marginBottom: 20 }}>Relatórios de Frequência</h2>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <button 
          onClick={() => setActiveTab('ranking')}
          style={{ 
            background: activeTab === 'ranking' ? 'var(--ouro)' : 'var(--fundo-card)', 
            color: activeTab === 'ranking' ? '#000' : 'var(--cinza)',
            border: 'none', padding: '10px 20px', borderRadius: 8, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 8, fontWeight: 'bold'
          }}>
          <Trophy size={18} /> Ranking de Atletas
        </button>
        <button 
          onClick={() => setActiveTab('treinos')}
          style={{ 
            background: activeTab === 'treinos' ? 'var(--ouro)' : 'var(--fundo-card)', 
            color: activeTab === 'treinos' ? '#000' : 'var(--cinza)',
            border: 'none', padding: '10px 20px', borderRadius: 8, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 8, fontWeight: 'bold'
          }}>
          <CalendarDays size={18} /> Histórico de Treinos
        </button>
      </div>

      {activeTab === 'ranking' && (
        <div className="card">
          <h3 style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Users size={20} color="var(--ouro)"/> Desempenho Geral de Frequência
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ padding: '10px', borderBottom: '1px solid #333' }}>Atleta</th>
                  <th style={{ padding: '10px', borderBottom: '1px solid #333' }}>Categoria</th>
                  <th style={{ padding: '10px', borderBottom: '1px solid #333', textAlign: 'center' }}>Presenças</th>
                  <th style={{ padding: '10px', borderBottom: '1px solid #333', textAlign: 'center' }}>Faltas</th>
                  <th style={{ padding: '10px', borderBottom: '1px solid #333', textAlign: 'center' }}>Total</th>
                  <th style={{ padding: '10px', borderBottom: '1px solid #333', textAlign: 'center' }}>Frequência (%)</th>
                </tr>
              </thead>
              <tbody>
                {ranking.length === 0 ? (
                  <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>Nenhum dado encontrado.</td></tr>
                ) : (
                  ranking.map((r, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #222' }}>
                      <td style={{ padding: '10px' }}><strong>{r.nome}</strong></td>
                      <td style={{ padding: '10px' }}>{r.categoria_nome}</td>
                      <td style={{ padding: '10px', textAlign: 'center', color: '#10b981' }}>{r.presencas}</td>
                      <td style={{ padding: '10px', textAlign: 'center', color: '#ef4444' }}>{r.faltas}</td>
                      <td style={{ padding: '10px', textAlign: 'center' }}>{r.total_treinos}</td>
                      <td style={{ padding: '10px', textAlign: 'center' }}>
                        <span style={{ 
                          background: getFrequenciaColor(r.frequencia), 
                          color: '#fff', padding: '4px 8px', borderRadius: 12, fontWeight: 'bold', fontSize: 14
                        }}>
                          {r.frequencia}%
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'treinos' && (
        <div className="card">
          <h3 style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
            <CalendarDays size={20} color="var(--ouro)"/> Treinos Realizados
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 15 }}>
            {treinos.length === 0 ? (
              <p>Nenhum treino registrado ainda.</p>
            ) : (
              treinos.map(t => (
                <div key={t.id} 
                     onClick={() => openTreino(t)}
                     style={{ 
                       background: 'var(--fundo)', padding: 15, borderRadius: 8, border: '1px solid #333',
                       cursor: 'pointer', transition: '0.2s'
                     }}
                     onMouseOver={e => e.currentTarget.style.borderColor = 'var(--ouro)'}
                     onMouseOut={e => e.currentTarget.style.borderColor = '#333'}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <span style={{ color: 'var(--cinza)', fontSize: 14 }}>
                      {new Date(t.data + 'T00:00:00').toLocaleDateString('pt-BR')}
                    </span>
                    <span style={{ background: '#333', padding: '2px 8px', borderRadius: 4, fontSize: 12 }}>
                      {t.categoria_nome}
                    </span>
                  </div>
                  <h4 style={{ marginBottom: 15 }}>{t.titulo}</h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                    <span style={{ color: '#10b981' }}>{t.presentes} Presentes</span>
                    <span style={{ color: '#ef4444' }}>{t.ausentes} Faltas</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Modal Detalhe do Treino */}
      {modalTreino && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{ 
            background: 'var(--fundo-card)', width: '90%', maxWidth: 500, borderRadius: 12, padding: 25,
            maxHeight: '90vh', overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ color: 'var(--ouro)' }}>Lista de Presença</h3>
              <button onClick={() => setModalTreino(null)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>
            
            <p style={{ color: 'var(--cinza)', marginBottom: 5 }}>Data: {new Date(modalTreino.data + 'T00:00:00').toLocaleDateString('pt-BR')}</p>
            <p style={{ color: 'var(--cinza)', marginBottom: 20 }}>Categoria: {modalTreino.categoria_nome}</p>

            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ paddingBottom: 10, borderBottom: '1px solid #333' }}>Atleta</th>
                  <th style={{ textAlign: 'right', paddingBottom: 10, borderBottom: '1px solid #333' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {presencasDetail.map((p, idx) => (
                  <tr key={idx}>
                    <td style={{ padding: '10px 0', borderBottom: '1px solid #222' }}>{p.atleta_nome}</td>
                    <td style={{ textAlign: 'right', padding: '10px 0', borderBottom: '1px solid #222' }}>
                      <span style={{ 
                        background: p.status === 'P' ? '#10b98122' : '#ef444422',
                        color: p.status === 'P' ? '#10b981' : '#ef4444',
                        padding: '4px 12px', borderRadius: 4, fontWeight: 'bold'
                      }}>
                        {p.status === 'P' ? 'Presente' : 'Falta'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}

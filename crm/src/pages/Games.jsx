import { useState, useEffect, useContext } from 'react';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import { Plus, Trophy, Save, X, CheckSquare, Edit2 } from 'lucide-react';

export default function Games() {
  const { user } = useContext(AuthContext);
  const isAdmin = ['Administrador', 'admin', 'Admin'].includes(user?.perfil);
  
  const [jogos, setJogos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categorias, setCategorias] = useState([]);
  
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingData, setEditingData] = useState(null);
  
  const [form, setForm] = useState({ titulo: '', data: '', categorias_ids: [] });
  
  const [showConvocacao, setShowConvocacao] = useState(false);
  const [selectedJogo, setSelectedJogo] = useState(null);
  const [atletas, setAtletas] = useState([]);
  
  // To quickly check if convocado
  const [convocadosSet, setConvocadosSet] = useState(new Set());
  const [activeCategoryTab, setActiveCategoryTab] = useState(null);

  useEffect(() => {
    loadJogos();
    loadCategorias();
  }, []);

  const loadJogos = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/admin/jogos');
      setJogos(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadCategorias = async () => {
    try {
      const res = await api.get('/api/admin/categorias');
      setCategorias(res.data.categorias || res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const openCreateModal = () => {
    setIsEditing(false);
    setForm({ titulo: '', data: '', categorias_ids: [] });
    setShowModal(true);
  };
  
  const openEditModal = (jogo) => {
    setIsEditing(true);
    setEditingData({ old_titulo: jogo.adversario, old_data: jogo.data_raw });
    setForm({ 
        titulo: jogo.adversario, 
        data: jogo.data_raw, 
        categorias_ids: jogo.categorias_ids ? jogo.categorias_ids.map(String) : [] 
    });
    setShowModal(true);
  };

  
  const handleDelete = async (jogo) => {
    if (!window.confirm(`Tem certeza que deseja excluir o jogo "${jogo.adversario}" do dia ${jogo.data_br}? Todas as convocações serão apagadas.`)) return;
    try {
      const res = await api.delete('/admin/eventos/deletar', { data: { titulo: jogo.adversario, data: jogo.data_raw } });
      if (res.data.success) {
        setJogos(jogos.filter(j => j.adversario !== jogo.adversario || j.data_raw !== jogo.data_raw));
      }
    } catch (e) {
      alert("Erro ao excluir jogo");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
          await api.put('/api/admin/eventos/editar', {
              old_titulo: editingData.old_titulo,
              old_data: editingData.old_data,
              new_titulo: form.titulo,
              new_data: form.data,
              new_categorias_ids: form.categorias_ids
          });
      } else {
          await api.post('/api/admin/eventos', { ...form, tipo: 'JOGO' });
      }
      setShowModal(false);
      loadJogos();
    } catch (e) {
      alert('Erro ao salvar jogo: ' + (e.response?.data?.error || e.message));
    }
  };

  const openConvocacao = async (jogo) => {
    setSelectedJogo(jogo);
    try {
      const res = await api.post(`/api/admin/jogos/multi-convocados`, { treino_ids: jogo.treino_ids });
      setAtletas(res.data);
      
      const sel = new Set();
      res.data.forEach(a => {
        if (a.convocado) sel.add(a.id);
      });
      setConvocadosSet(sel);
      
      // Set the first category as active tab
      if (jogo.categorias_nomes && jogo.categorias_nomes.length > 0) {
          setActiveCategoryTab(jogo.categorias_nomes[0]);
      }
      
      setShowConvocacao(true);
    } catch (e) {
      alert('Erro ao carregar atletas.');
    }
  };

  const toggleConvocacao = async (atleta) => {
    const isCurrentlyConvocated = convocadosSet.has(atleta.id);
    const newState = !isCurrentlyConvocated;
    
    // Update local state for immediate feedback
    const next = new Set(convocadosSet);
    if (newState) next.add(atleta.id);
    else next.delete(atleta.id);
    setConvocadosSet(next);
    
    // Auto-save to backend
    try {
        await api.post('/api/admin/jogos/toggle-convocacao', {
            atleta_id: atleta.id,
            treino_id: atleta.treino_id,
            state: newState
        });
    } catch (e) {
        console.error("Erro ao salvar", e);
        alert("Ocorreu um erro ao atualizar a convocação.");
        // Rollback state if error
        const rollback = new Set(convocadosSet);
        if (isCurrentlyConvocated) rollback.add(atleta.id);
        else rollback.delete(atleta.id);
        setConvocadosSet(rollback);
    }
  };

  // Group athletes by category for the modal
  const athletesByCategory = atletas.reduce((acc, a) => {
      acc[a.categoria_nome] = acc[a.categoria_nome] || [];
      acc[a.categoria_nome].push(a);
      return acc;
  }, {});

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
        <div>
          <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Trophy color="var(--ouro)" /> Jogos & Convocações
          </h2>
          <p style={{ margin: '5px 0 0 0', color: 'var(--cinza)' }}>Gerencie os próximos jogos e convoque seus atletas.</p>
        </div>
        {isAdmin && (
          <button className="btn primary" onClick={openCreateModal} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Plus size={18} /> Agendar Jogo
          </button>
        )}
      </div>

      <div className="card">
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--cinza)' }}>Carregando...</div>
        ) : jogos.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--cinza)' }}>Nenhum jogo encontrado.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                <th style={{ padding: 15, textAlign: 'left', borderBottom: '1px solid var(--linha)', color: 'var(--cinza)', fontWeight: 500 }}>Data</th>
                <th style={{ padding: 15, textAlign: 'left', borderBottom: '1px solid var(--linha)', color: 'var(--cinza)', fontWeight: 500 }}>Adversário</th>
                <th style={{ padding: 15, textAlign: 'left', borderBottom: '1px solid var(--linha)', color: 'var(--cinza)', fontWeight: 500 }}>Categorias Envolvidas</th>
                <th style={{ padding: 15, textAlign: 'right', borderBottom: '1px solid var(--linha)', color: 'var(--cinza)', fontWeight: 500 }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {jogos.map(j => (
                <tr key={j.id} className="interactive">
                  <td style={{ padding: 15, borderBottom: '1px solid var(--linha)' }}>
                    <span style={{ color: '#EF4444', fontWeight: 'bold' }}>{j.data_br}</span>
                  </td>
                  <td style={{ padding: 15, borderBottom: '1px solid var(--linha)', color: 'var(--texto)' }}>{j.adversario}</td>
                  <td style={{ padding: 15, borderBottom: '1px solid var(--linha)' }}>
                    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                        {j.categorias_nomes && j.categorias_nomes.map((cnome, idx) => (
                            <span key={idx} style={{ background: 'rgba(248, 193, 70, 0.2)', color: 'var(--ouro)', padding: '4px 10px', borderRadius: 12, fontSize: 12 }}>
                                {cnome}
                            </span>
                        ))}
                    </div>
                  </td>
                  <td style={{ padding: 15, borderBottom: '1px solid var(--linha)', textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                    {isAdmin && (
                        <>
                            <button className="btn outline" onClick={() => openEditModal(j)} style={{ padding: '6px 12px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 5 }}>
                                <Edit2 size={14} /> Editar
                            </button>
                            <button className="btn outline" onClick={() => handleDelete(j)} style={{ padding: '6px 12px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 5, borderColor: '#ff4444', color: '#ff4444' }}>
                                <Trash2 size={14} /> Excluir
                            </button>
                        </>
                    )}
                    <button className="btn outline" onClick={() => openConvocacao(j)} style={{ padding: '6px 12px', fontSize: 13 }}>
                      Gerir Convocação
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Criar/Editar Jogo */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
          <div className="card" style={{ width: '100%', maxWidth: 500, padding: 30, position: 'relative' }}>
            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', color: 'var(--cinza)', cursor: 'pointer' }}>
              <X size={24} />
            </button>
            <h3 style={{ margin: '0 0 20px 0' }}>{isEditing ? 'Editar Jogo' : 'Agendar Novo Jogo'}</h3>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 5, color: 'var(--cinza)' }}>Adversário / Título</label>
                <input className="input" required value={form.titulo} onChange={e => setForm({...form, titulo: e.target.value})} placeholder="Ex: Jogo contra Flamengo" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 5, color: 'var(--cinza)' }}>Data</label>
                <input type="date" className="input" required value={form.data} onChange={e => setForm({...form, data: e.target.value})} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 5, color: 'var(--cinza)' }}>Campeonato / Liga (Opcional)</label>
                <input className="input" value={form.campeonato} onChange={e => setForm({...form, campeonato: e.target.value})} placeholder="Ex: Paulistão Sub-20" />
              </div>
              <div style={{ display: 'flex', gap: 15 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: 5, color: 'var(--cinza)' }}>Horário (Opcional)</label>
                    <input type="time" className="input" value={form.horario} onChange={e => setForm({...form, horario: e.target.value})} />
                  </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 5, color: 'var(--cinza)' }}>Observações (Opcional)</label>
                <textarea className="input" value={form.observacao} onChange={e => setForm({...form, observacao: e.target.value})} placeholder="Instruções, local da partida, etc..." rows={3} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 5, color: 'var(--cinza)' }}>Categorias Participantes</label>
                <select 
                  className="input" 
                  value="" 
                  onChange={(e) => {
                    const strId = e.target.value;
                    if (!strId) return;
                    if (!form.categorias_ids.includes(strId)) {
                        setForm(prev => ({ ...prev, categorias_ids: [...prev.categorias_ids, strId] }));
                    }
                  }}
                  style={{ marginBottom: 10 }}
                >
                  <option value="">Selecione uma categoria para adicionar...</option>
                  {categorias.filter(c => !form.categorias_ids.includes(c.id.toString())).map(c => (
                    <option key={c.id} value={c.id}>{c.nome}</option>
                  ))}
                </select>
                
                {form.categorias_ids.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: '10px 0' }}>
                    {form.categorias_ids.map(id => {
                      const cat = categorias.find(c => c.id.toString() === id);
                      const catName = cat ? cat.nome : 'Desconhecida';
                      return (
                        <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(248, 193, 70, 0.2)', border: '1px solid var(--ouro)', color: 'var(--ouro)', padding: '6px 12px', borderRadius: 20, fontSize: 13, fontWeight: 'bold' }}>
                          {catName}
                          <X 
                            size={14} 
                            style={{ cursor: 'pointer', opacity: 0.8 }} 
                            onClick={() => {
                              setForm(prev => ({ ...prev, categorias_ids: prev.categorias_ids.filter(i => i !== id) }));
                            }} 
                            onMouseEnter={e => e.target.style.opacity = 1}
                            onMouseLeave={e => e.target.style.opacity = 0.8}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              <button type="submit" className="btn primary" style={{ marginTop: 10 }}>
                {isEditing ? 'Salvar Alterações' : 'Criar Jogo'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Convocações Dinâmico */}
      {showConvocacao && selectedJogo && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
          <div className="card" style={{ width: '100%', maxWidth: 700, width: '95%', padding: '20px',  position: 'relative', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
            <button onClick={() => setShowConvocacao(false)} style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', color: 'var(--cinza)', cursor: 'pointer' }}>
              <X size={24} />
            </button>
            <h3 style={{ margin: '0 0 5px 0' }}>Convocação Oficial</h3>
            <p style={{ margin: '0 0 20px 0', color: 'var(--cinza)' }}>{selectedJogo.adversario} - {selectedJogo.data_br}</p>

            {/* Abas das categorias */}
            <div style={{ display: 'flex', gap: 10, borderBottom: '1px solid var(--linha)', paddingBottom: 10, marginBottom: 20, overflowX: 'auto', flexWrap: 'nowrap', WebkitOverflowScrolling: 'touch' }}>
                {Object.keys(athletesByCategory).map(catName => {
                    const totalAtletas = athletesByCategory[catName].length;
                    const convocadosCount = athletesByCategory[catName].filter(a => convocadosSet.has(a.id)).length;
                    const isActive = activeCategoryTab === catName;
                    return (
                        <button 
                            key={catName} 
                            onClick={() => setActiveCategoryTab(catName)}
                            style={{ 
                                background: isActive ? 'var(--ouro)' : 'rgba(255,255,255,0.05)', 
                                color: isActive ? '#000' : 'var(--cinza)',
                                border: 'none', padding: '8px 16px', borderRadius: 20, cursor: 'pointer', fontWeight: isActive ? 'bold' : 'normal',
                                whiteSpace: 'nowrap', flexShrink: 0
                            }}
                        >
                            {catName} ({convocadosCount}/{totalAtletas})
                        </button>
                    )
                })}
            </div>

            <div style={{ overflowY: 'auto', flex: 1, paddingRight: 5 }}>
                {activeCategoryTab && athletesByCategory[activeCategoryTab] && athletesByCategory[activeCategoryTab].length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 15, paddingRight: 5 }}>
                        {athletesByCategory[activeCategoryTab].map(a => {
                            const isConvocated = convocadosSet.has(a.id);
                            return (
                                <div key={a.id} onClick={() => toggleConvocacao(a)} className="interactive" style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: 15, background: isConvocated ? 'rgba(248, 193, 70, 0.1)' : 'rgba(255,255,255,0.02)', border: isConvocated ? '1px solid var(--ouro)' : '1px solid var(--linha)', borderRadius: 8, cursor: 'pointer', transition: 'all 0.2s' }}>
                                    <div style={{ width: 24, height: 24, borderRadius: 6, border: '2px solid', borderColor: isConvocated ? 'var(--ouro)' : 'var(--cinza)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2, background: isConvocated ? 'var(--ouro)' : 'transparent' }}>
                                        {isConvocated && <CheckSquare size={16} color="#000" />}
                                    </div>
                                    <div>
                                        <div style={{ color: 'var(--texto)', fontSize: 14, fontWeight: isConvocated ? 'bold' : 'normal', lineHeight: '1.3', marginBottom: 2 }}>{a.nome}</div>
                                        <div style={{ color: 'var(--cinza)', fontSize: 12 }}>{a.posicao || 'Não informada'}</div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <p style={{ color: 'var(--cinza)', textAlign: 'center' }}>Nenhum atleta nesta categoria.</p>
                )}
            </div>
            <div style={{ marginTop: 20, textAlign: 'center', color: 'var(--cinza)', fontSize: 12 }}>
                O salvamento é automático ao clicar no atleta.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

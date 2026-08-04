import { useState, useEffect, useContext } from 'react';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import { Plus, Trophy, Save, X, CheckSquare } from 'lucide-react';

export default function Games() {
  const { user } = useContext(AuthContext);
  const isAdmin = ['Administrador', 'admin', 'Admin'].includes(user?.perfil);
  
  const [jogos, setJogos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categorias, setCategorias] = useState([]);
  
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ titulo: '', data: '', categorias_ids: [] });
  
  const [showConvocacao, setShowConvocacao] = useState(false);
  const [selectedJogo, setSelectedJogo] = useState(null);
  const [atletas, setAtletas] = useState([]);
  const [convocadosIds, setConvocadosIds] = useState(new Set());

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

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/admin/eventos', { ...form, tipo: 'JOGO' });
      setShowModal(false);
      setForm({ titulo: '', data: '', categorias_ids: [] });
      loadJogos();
    } catch (e) {
      alert('Erro ao criar jogo: ' + (e.response?.data?.error || e.message));
    }
  };

  const openConvocacao = async (jogo) => {
    setSelectedJogo(jogo);
    try {
      const res = await api.get(`/api/admin/jogos/${jogo.id}/convocados`);
      setAtletas(res.data);
      const sel = new Set();
      res.data.forEach(a => {
        if (a.convocado) sel.add(a.id);
      });
      setConvocadosIds(sel);
      setShowConvocacao(true);
    } catch (e) {
      alert('Erro ao carregar atletas.');
    }
  };

  const toggleConvocacao = (id) => {
    const next = new Set(convocadosIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setConvocadosIds(next);
  };

  const saveConvocacao = async () => {
    try {
      await api.post(`/api/admin/jogos/${selectedJogo.id}/convocacao`, {
        atletas_ids: Array.from(convocadosIds)
      });
      alert('Convocação salva com sucesso!');
      setShowConvocacao(false);
    } catch (e) {
      alert('Erro ao salvar.');
    }
  };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
        <div>
          <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Trophy color="var(--ouro)" /> Jogos & Convocações
          </h2>
          <p style={{ color: 'var(--cinza)', margin: '5px 0 0 0' }}>Gerencie jogos e a lista de convocados.</p>
        </div>
        {isAdmin && (
          <button className="btn primary" onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Plus size={20} /> Agendar Jogo
          </button>
        )}
      </div>

      <div className="card">
        {loading ? <p style={{ padding: 20 }}>Carregando...</p> : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: 15, borderBottom: '1px solid var(--linha)', color: 'var(--cinza)' }}>Data</th>
                <th style={{ textAlign: 'left', padding: 15, borderBottom: '1px solid var(--linha)', color: 'var(--cinza)' }}>Adversário</th>
                <th style={{ textAlign: 'left', padding: 15, borderBottom: '1px solid var(--linha)', color: 'var(--cinza)' }}>Categoria</th>
                <th style={{ textAlign: 'right', padding: 15, borderBottom: '1px solid var(--linha)', color: 'var(--cinza)' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {jogos.length === 0 ? (
                <tr><td colSpan="4" style={{ padding: 20, textAlign: 'center', color: 'var(--cinza)' }}>Nenhum jogo encontrado.</td></tr>
              ) : jogos.map(j => (
                <tr key={j.id} className="interactive">
                  <td style={{ padding: 15, borderBottom: '1px solid var(--linha)', fontWeight: 'bold' }}>{j.data_br}</td>
                  <td style={{ padding: 15, borderBottom: '1px solid var(--linha)' }}>{j.adversario}</td>
                  <td style={{ padding: 15, borderBottom: '1px solid var(--linha)' }}>
                    <span style={{ background: 'rgba(248, 193, 70, 0.2)', color: 'var(--ouro)', padding: '4px 10px', borderRadius: 12, fontSize: 12 }}>
                      {j.categoria_nome}
                    </span>
                  </td>
                  <td style={{ padding: 15, borderBottom: '1px solid var(--linha)', textAlign: 'right' }}>
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

      {/* Modal Criar Jogo */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
          <div className="card" style={{ width: '100%', maxWidth: 500, padding: 30, position: 'relative' }}>
            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', color: 'var(--cinza)', cursor: 'pointer' }}>
              <X size={24} />
            </button>
            <h3 style={{ margin: '0 0 20px 0' }}>Agendar Novo Jogo</h3>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 5, color: 'var(--cinza)' }}>Adversário / Título</label>
                <input type="text" className="input" required value={form.titulo} onChange={e => setForm({...form, titulo: e.target.value})} placeholder="Ex: vs Time B" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 5, color: 'var(--cinza)' }}>Data</label>
                <input type="date" className="input" required value={form.data} onChange={e => setForm({...form, data: e.target.value})} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 5, color: 'var(--cinza)' }}>Categorias (Selecione uma ou mais)</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, background: 'rgba(255,255,255,0.02)', padding: 10, borderRadius: 8, border: '1px solid var(--linha)' }}>
                  {categorias.map(c => (
                    <label key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: 'var(--texto)' }}>
                      <input 
                        type="checkbox" 
                        checked={form.categorias_ids.includes(c.id.toString())}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          const strId = c.id.toString();
                          setForm(prev => {
                            const newIds = checked 
                              ? [...prev.categorias_ids, strId] 
                              : prev.categorias_ids.filter(id => id !== strId);
                            return { ...prev, categorias_ids: newIds };
                          });
                        }}
                      />
                      {c.nome}
                    </label>
                  ))}
                </div>
              </div>
              <button type="submit" className="btn primary" style={{ marginTop: 10 }}>Salvar Jogo</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Convocacao */}
      {showConvocacao && selectedJogo && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
          <div className="card" style={{ width: '100%', maxWidth: 600, padding: 30, position: 'relative', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
            <button onClick={() => setShowConvocacao(false)} style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', color: 'var(--cinza)', cursor: 'pointer' }}>
              <X size={24} />
            </button>
            <h3 style={{ margin: '0 0 5px 0' }}>Convocação</h3>
            <p style={{ margin: '0 0 20px 0', color: 'var(--cinza)' }}>{selectedJogo.adversario} ({selectedJogo.data_br}) - {selectedJogo.categoria_nome}</p>
            
            <div style={{ overflowY: 'auto', flex: 1, paddingRight: 10 }}>
              {atletas.length === 0 ? (
                <p style={{ color: 'var(--cinza)' }}>Nenhum atleta nesta categoria.</p>
              ) : (
                <div style={{ display: 'grid', gap: 10 }}>
                  {atletas.map(a => {
                    const isSel = convocadosIds.has(a.id);
                    return (
                      <div key={a.id} onClick={() => toggleConvocacao(a.id)} style={{
                        display: 'flex', alignItems: 'center', padding: 15, background: isSel ? 'rgba(248, 193, 70, 0.15)' : 'rgba(255,255,255,0.03)',
                        border: isSel ? '1px solid var(--ouro)' : '1px solid var(--linha)', borderRadius: 8, cursor: 'pointer', transition: '0.2s'
                      }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 'bold', color: isSel ? 'var(--ouro)' : 'var(--texto)' }}>{a.nome}</div>
                          <div style={{ fontSize: 12, color: 'var(--cinza)' }}>{a.posicao}</div>
                        </div>
                        <div style={{ color: isSel ? 'var(--ouro)' : 'var(--linha)' }}>
                          <CheckSquare size={24} fill={isSel ? 'var(--ouro)' : 'transparent'} color={isSel ? '#1a1a1a' : 'currentColor'} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--linha)', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button className="btn outline" onClick={() => setShowConvocacao(false)}>Cancelar</button>
              <button className="btn primary" onClick={saveConvocacao} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Save size={18} /> Salvar Convocação
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

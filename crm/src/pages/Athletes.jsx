import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api';
import { Activity, Plus, Edit, Trash2, Search, Filter } from 'lucide-react';

export default function Athletes() {
  const [atletas, setAtletas] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [form, setForm] = useState({ nome: '', categoria_id: '', posicao: '', nome_responsavel: '', telefone_responsavel: '', status_medico: 'Apto' });

  const { user } = useContext(AuthContext);
  const isAdmin = ['Administrador', 'admin', 'Admin'].includes(user?.perfil);
  
  const [treinadores, setTreinadores] = useState([]);
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroTreinador, setFiltroTreinador] = useState('');
  const [busca, setBusca] = useState('');


  
  const loadTreinadores = async () => {
    if (!isAdmin) return;
    try {
      const res = await api.get('/api/admin/treinadores');
      setTreinadores(res.data.treinadores || []);
    } catch (e) { console.error(e); }
  };

  const loadCategorias = async () => {
    try {
      const res = await api.get('/api/admin/categorias');
      setCategorias(res.data.categorias || res.data);
    } catch (e) { console.error(e); }
  };

  const loadAtletas = async () => {
    try {
      const res = await api.get('/api/admin/atletas');
      setAtletas(res.data.atletas || res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => { loadAtletas(); loadCategorias(); loadTreinadores(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await api.put(`/api/admin/atletas/${editingId}`, form);
      } else {
        await api.post('/api/admin/atletas', form);
      }
      setShowForm(false);
      setEditMode(false);
      setEditingId(null);
      loadAtletas();
      setForm({ nome: '', categoria_id: '', posicao: '', nome_responsavel: '', telefone_responsavel: '', status_medico: 'Apto' });
    } catch (e) {
      alert('Erro ao salvar atleta');
    }
  };

  const handleEdit = (a) => {
    setForm(a);
    setEditingId(a.id);
    setEditMode(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este atleta?')) {
      try {
        await api.delete(`/api/admin/atletas/${id}`);
        loadAtletas();
      } catch (e) {
        alert('Erro ao excluir atleta');
      }
    }
  };

  const toggleDM = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Lesionado' ? 'Apto' : 'Lesionado';
    try {
      await api.put(`/api/admin/atletas/${id}/status`, { status_medico: newStatus });
      loadAtletas();
    } catch (e) {
      alert('Erro ao atualizar status');
    }
  };

  
  const tdStyle = { padding: '15px', borderBottom: '1px solid var(--linha)' };

  const rawList = Array.isArray(atletas) ? atletas : (atletas?.atletas || []);
  
  const list = rawList.filter(a => {
    let matchCat = true;
    let matchTreinador = true;
    let matchBusca = true;

    if (filtroCategoria) {
      matchCat = a.categoria_id === parseInt(filtroCategoria);
    }
    
    if (filtroTreinador && treinadores.length > 0) {
      const t = treinadores.find(tr => tr.id === parseInt(filtroTreinador));
      if (t && t.categorias) {
        matchTreinador = t.categorias.some(c => c.id === a.categoria_id);
      } else {
        matchTreinador = false;
      }
    }

    if (busca) {
      matchBusca = a.nome.toLowerCase().includes(busca.toLowerCase());
    }

    return matchCat && matchTreinador && matchBusca;
  });


  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
        <h1 style={{ color: 'var(--ouro)' }}>Gestão de Atletas</h1>
        <button onClick={() => { setShowForm(!showForm); setEditMode(false); setForm({ nome: '', categoria_id: '', posicao: '', nome_responsavel: '', telefone_responsavel: '', status_medico: 'Apto' }); }} className="btn" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Plus size={20} /> Novo Atleta
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 30 }}>
          <h3>{editMode ? 'Editar Atleta' : 'Cadastrar Novo Atleta'}</h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15, marginTop: 15 }}>
            <div style={{ gridColumn: '1 / -1' }}><label>Nome Completo</label><input type="text" value={form.nome} onChange={e=>setForm({...form, nome: e.target.value})} required /></div>
            <div><label>Categoria</label><select value={form.categoria_id || ""} onChange={e=>setForm({...form, categoria_id: e.target.value})}><option value="">Selecione...</option>{categorias.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}</select></div>
            <div><label>Posição</label><input type="text" value={form.posicao} onChange={e=>setForm({...form, posicao: e.target.value})} placeholder="Ex: Atacante" /></div>
            <div><label>Nome do Responsável</label><input type="text" value={form.nome_responsavel} onChange={e=>setForm({...form, nome_responsavel: e.target.value})} /></div>
            <div><label>Telefone</label><input type="text" value={form.telefone_responsavel} onChange={e=>setForm({...form, telefone_responsavel: e.target.value})} /></div>
            <div style={{ gridColumn: '1 / -1' }}><button type="submit" className="btn">{editMode ? 'Atualizar Atleta' : 'Salvar Atleta'}</button></div>
          </form>
        </div>
      )}


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
        <table >
          <thead>
            <tr><th style={{...tdStyle, color: 'var(--cinza)', textAlign: 'left'}}>Nome</th><th style={{...tdStyle, color: 'var(--cinza)', textAlign: 'left'}}>Categoria</th><th style={{...tdStyle, color: 'var(--cinza)', textAlign: 'left'}}>Posição</th><th style={{...tdStyle, color: 'var(--cinza)', textAlign: 'left'}}>Status Médico</th><th style={{...tdStyle, color: 'var(--cinza)', textAlign: 'left'}}>Ações</th></tr>
          </thead>
          <tbody>
            {list.map(a => (
              <tr key={a.id}>
                <td ><strong>{a.nome}</strong></td>
                <td >{a.categoria}</td>
                <td >{a.posicao || '-'}</td>
                <td >
                  <span style={{ padding: '4px 8px', borderRadius: 12, fontSize: 12, background: a.status_medico === 'Lesionado' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.2)', color: a.status_medico === 'Lesionado' ? '#ef4444' : '#22c55e' }}>
                    {a.status_medico || 'Apto'}
                  </span>
                </td>
                <td >
                  <div style={{ display: 'flex', gap: 5 }}>
                    <button onClick={() => toggleDM(a.id, a.status_medico)} title="Alternar DM" style={{ padding: 8, borderRadius: 8, background: 'rgba(255,255,255,0.1)', color: '#fff' }}><Activity size={18} /></button>
                    <button onClick={() => handleEdit(a)} title="Editar" style={{ padding: 8, borderRadius: 8, background: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6' }}><Edit size={18} /></button>
                    <button onClick={() => handleDelete(a.id)} title="Excluir" style={{ padding: 8, borderRadius: 8, background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' }}><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {list.length === 0 && <tr><td colSpan="5" style={{...tdStyle, textAlign: 'center', color: 'var(--cinza)'}}>Nenhum atleta cadastrado.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

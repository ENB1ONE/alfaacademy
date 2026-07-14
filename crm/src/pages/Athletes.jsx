import { useState, useEffect } from 'react';
import api from '../api';
import { Activity, Plus } from 'lucide-react';

export default function Athletes() {
  const [atletas, setAtletas] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nome: '', categoria: 'Sub-15', posicao: '', nome_responsavel: '', telefone_responsavel: '', status_medico: 'Apto' });

  const loadAtletas = async () => {
    try {
      const res = await api.get('/api/admin/atletas');
      setAtletas(res.data.atletas || res.data); // Depende do retorno da API
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => { loadAtletas(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/admin/atletas', form);
      setShowForm(false);
      loadAtletas();
      setForm({ nome: '', categoria: 'Sub-15', posicao: '', nome_responsavel: '', telefone_responsavel: '', status_medico: 'Apto' });
    } catch (e) {
      alert('Erro ao cadastrar atleta');
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

  const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: 20 };
  const thStyle = { textAlign: 'left', padding: '12px 15px', borderBottom: '1px solid var(--linha)', color: 'var(--cinza)' };
  const tdStyle = { padding: '15px', borderBottom: '1px solid var(--linha)' };

  // Helper para normalizar o array de atletas vindo da API
  const list = Array.isArray(atletas) ? atletas : (atletas?.atletas || []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
        <h1 style={{ color: 'var(--ouro)' }}>Gestão de Atletas</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Plus size={20} /> Novo Atleta
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 30 }}>
          <h3>Cadastrar Novo Atleta</h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15, marginTop: 15 }}>
            <div style={{ gridColumn: '1 / -1' }}><label>Nome Completo</label><input type="text" value={form.nome} onChange={e=>setForm({...form, nome: e.target.value})} required /></div>
            <div><label>Categoria</label><select value={form.categoria} onChange={e=>setForm({...form, categoria: e.target.value})}><option>Sub-11</option><option>Sub-13</option><option>Sub-15</option><option>Sub-17</option><option>Sub-20</option></select></div>
            <div><label>Posição</label><input type="text" value={form.posicao} onChange={e=>setForm({...form, posicao: e.target.value})} placeholder="Ex: Atacante" /></div>
            <div><label>Nome do Responsável</label><input type="text" value={form.nome_responsavel} onChange={e=>setForm({...form, nome_responsavel: e.target.value})} /></div>
            <div><label>Telefone</label><input type="text" value={form.telefone_responsavel} onChange={e=>setForm({...form, telefone_responsavel: e.target.value})} /></div>
            <div style={{ gridColumn: '1 / -1' }}><button type="submit" className="btn">Salvar Atleta</button></div>
          </form>
        </div>
      )}

      <div className="card" style={{ padding: '0 20px 20px 20px' }}>
        <table style={tableStyle}>
          <thead>
            <tr><th>Nome</th><th>Categoria</th><th>Posição</th><th>Status Médico</th><th>Ações</th></tr>
          </thead>
          <tbody>
            {list.map(a => (
              <tr key={a.id}>
                <td style={tdStyle}><strong>{a.nome}</strong></td>
                <td style={tdStyle}>{a.categoria}</td>
                <td style={tdStyle}>{a.posicao || '-'}</td>
                <td style={tdStyle}>
                  <span style={{ padding: '4px 8px', borderRadius: 12, fontSize: 12, background: a.status_medico === 'Lesionado' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.2)', color: a.status_medico === 'Lesionado' ? '#ef4444' : '#22c55e' }}>
                    {a.status_medico || 'Apto'}
                  </span>
                </td>
                <td style={tdStyle}>
                  <button onClick={() => toggleDM(a.id, a.status_medico)} title="Alternar Departamento Médico" style={{ padding: 8, borderRadius: 8, background: 'rgba(255,255,255,0.1)', color: '#fff' }}>
                    <Activity size={18} />
                  </button>
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

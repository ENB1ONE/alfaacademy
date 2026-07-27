# 5. Athletes.jsx
athletes_jsx = """import { useState, useEffect } from 'react';
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
        <h1 style={{ color: 'var(--ouro)' }}>GestA£o de Atletas</h1>
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
            <div><label>PosiA§A£o</label><input type="text" value={form.posicao} onChange={e=>setForm({...form, posicao: e.target.value})} placeholder="Ex: Atacante" /></div>
            <div><label>Nome do ResponsA¡vel</label><input type="text" value={form.nome_responsavel} onChange={e=>setForm({...form, nome_responsavel: e.target.value})} /></div>
            <div><label>Telefone</label><input type="text" value={form.telefone_responsavel} onChange={e=>setForm({...form, telefone_responsavel: e.target.value})} /></div>
            <div style={{ gridColumn: '1 / -1' }}><button type="submit" className="btn">Salvar Atleta</button></div>
          </form>
        </div>
      )}

      <div className="card" style={{ padding: '0 20px 20px 20px' }}>
        <table style={tableStyle}>
          <thead>
            <tr><th>Nome</th><th>Categoria</th><th>PosiA§A£o</th><th>Status MAadico</th><th>AA§Aµes</th></tr>
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
                  <button onClick={() => toggleDM(a.id, a.status_medico)} title="Alternar Departamento MAadico" style={{ padding: 8, borderRadius: 8, background: 'rgba(255,255,255,0.1)', color: '#fff' }}>
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
"""
with open("crm/src/pages/Athletes.jsx", "w", encoding="utf-8") as f: f.write(athletes_jsx.replace("A£", "ã").replace("A§", "ç").replace("A¡", "á").replace("AA", "Aç").replace("Aµ", "õ").replace("MAadico", "Médico"))

# 6. Staff.jsx
staff_jsx = """import { useState, useEffect } from 'react';
import api from '../api';
import { Plus } from 'lucide-react';

export default function Staff() {
  const [staff, setStaff] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nome: '', usuario_lc: '', senha: '', perfil: 'Treinador' });

  const loadStaff = async () => {
    try {
      const res = await api.get('/api/admin/treinadores');
      setStaff(res.data.treinadores || res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => { loadStaff(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/admin/treinadores', form);
      setShowForm(false);
      loadStaff();
      setForm({ nome: '', usuario_lc: '', senha: '', perfil: 'Treinador' });
    } catch (e) {
      alert('Erro ao cadastrar treinador');
    }
  };

  const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: 20 };
  const tdStyle = { padding: '15px', borderBottom: '1px solid var(--linha)' };

  const list = Array.isArray(staff) ? staff : (staff?.treinadores || []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
        <h1 style={{ color: 'var(--ouro)' }}>ComissA£o TAcnica</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Plus size={20} /> Novo Treinador
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 30 }}>
          <h3>Cadastrar Novo Membro</h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15, marginTop: 15 }}>
            <div style={{ gridColumn: '1 / -1' }}><label>Nome</label><input type="text" value={form.nome} onChange={e=>setForm({...form, nome: e.target.value})} required /></div>
            <div><label>UsuA¡rio de Login</label><input type="text" value={form.usuario_lc} onChange={e=>setForm({...form, usuario_lc: e.target.value})} required /></div>
            <div><label>Senha ProvisA³ria</label><input type="password" value={form.senha} onChange={e=>setForm({...form, senha: e.target.value})} required /></div>
            <div><label>Perfil</label><select value={form.perfil} onChange={e=>setForm({...form, perfil: e.target.value})}><option>Treinador</option><option>Administrador</option></select></div>
            <div style={{ gridColumn: '1 / -1' }}><button type="submit" className="btn">Salvar</button></div>
          </form>
        </div>
      )}

      <div className="card" style={{ padding: '0 20px 20px 20px' }}>
        <table style={tableStyle}>
          <thead>
            <tr><th style={{...tdStyle, color: 'var(--cinza)', textAlign: 'left'}}>Nome</th><th style={{...tdStyle, color: 'var(--cinza)', textAlign: 'left'}}>UsuA¡rio</th><th style={{...tdStyle, color: 'var(--cinza)', textAlign: 'left'}}>Perfil</th></tr>
          </thead>
          <tbody>
            {list.map(t => (
              <tr key={t.id}>
                <td style={tdStyle}><strong>{t.nome}</strong></td>
                <td style={tdStyle}>{t.usuario_lc || t.usuario}</td>
                <td style={tdStyle}>{t.perfil}</td>
              </tr>
            ))}
            {list.length === 0 && <tr><td colSpan="3" style={{...tdStyle, textAlign: 'center', color: 'var(--cinza)'}}>Nenhum treinador cadastrado.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
"""
with open("crm/src/pages/Staff.jsx", "w", encoding="utf-8") as f: f.write(staff_jsx.replace("A£", "ã").replace("TAcnica", "Técnica").replace("UsuA¡rio", "Usuário").replace("ProvisA³ria", "Provisória"))


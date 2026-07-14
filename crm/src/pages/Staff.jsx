import { useState, useEffect } from 'react';
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
        <h1 style={{ color: 'var(--ouro)' }}>Comissão Técnica</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Plus size={20} /> Novo Treinador
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 30 }}>
          <h3>Cadastrar Novo Membro</h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15, marginTop: 15 }}>
            <div style={{ gridColumn: '1 / -1' }}><label>Nome</label><input type="text" value={form.nome} onChange={e=>setForm({...form, nome: e.target.value})} required /></div>
            <div><label>Usuário de Login</label><input type="text" value={form.usuario_lc} onChange={e=>setForm({...form, usuario_lc: e.target.value})} required /></div>
            <div><label>Senha Provisória</label><input type="password" value={form.senha} onChange={e=>setForm({...form, senha: e.target.value})} required /></div>
            <div><label>Perfil</label><select value={form.perfil} onChange={e=>setForm({...form, perfil: e.target.value})}><option>Treinador</option><option>Administrador</option></select></div>
            <div style={{ gridColumn: '1 / -1' }}><button type="submit" className="btn">Salvar</button></div>
          </form>
        </div>
      )}

      <div className="card" style={{ padding: '0 20px 20px 20px' }}>
        <table style={tableStyle}>
          <thead>
            <tr><th style={{...tdStyle, color: 'var(--cinza)', textAlign: 'left'}}>Nome</th><th style={{...tdStyle, color: 'var(--cinza)', textAlign: 'left'}}>Usuário</th><th style={{...tdStyle, color: 'var(--cinza)', textAlign: 'left'}}>Perfil</th></tr>
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

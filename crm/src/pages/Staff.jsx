import React, { useState, useEffect, useContext } from 'react';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import { Edit2, Trash2, X } from 'lucide-react';

export default function Staff() {
  const { user } = useContext(AuthContext);
  const [treinadores, setTreinadores] = useState([]);
  const [allCategorias, setAllCategorias] = useState([]);
  
  const [form, setForm] = useState({ id: null, nome: '', usuario_lc: '', senha: '', perfil: 'Treinador', categorias: [] });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    carregarTreinadores();
    carregarCategorias();
  }, []);

  const carregarTreinadores = async () => {
    try {
      const res = await api.get('/api/admin/treinadores');
      setTreinadores(res.data.treinadores);
    } catch (e) { alert('Erro ao carregar comissão técnica.'); }
  };

  const carregarCategorias = async () => {
    try {
      const res = await api.get('/api/admin/categorias');
      setAllCategorias(res.data.categorias);
    } catch (e) { console.error('Erro categorias', e); }
  };

  const handleCheckbox = (catId) => {
    setForm(prev => {
      const cats = prev.categorias.includes(catId) 
        ? prev.categorias.filter(id => id !== catId)
        : [...prev.categorias, catId];
      return { ...prev, categorias: cats };
    });
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.put(`/api/admin/treinadores/${form.id}`, form);
        alert('Treinador atualizado!');
      } else {
        await api.post('/api/admin/treinadores', form);
        alert('Treinador cadastrado!');
      }
      setForm({ id: null, nome: '', usuario_lc: '', senha: '', perfil: 'Treinador', categorias: [] });
      setIsEditing(false);
      carregarTreinadores();
    } catch (e) { alert('Erro ao salvar treinador.'); }
  };

  const handleEditar = (t) => {
    setIsEditing(true);
    setForm({
      id: t.id, nome: t.nome, usuario_lc: t.usuario_lc, senha: '', perfil: t.perfil,
      categorias: t.categorias ? t.categorias.map(c => c.id) : []
    });
  };

  const handleExcluir = async (id) => {
    if (!window.confirm('Tem certeza?')) return;
    try {
      await api.delete(`/api/admin/treinadores/${id}`);
      carregarTreinadores();
    } catch (e) { alert('Erro ao excluir treinador.'); }
  };

  if (user?.perfil !== 'Administrador' && user?.perfil !== 'admin') {
    return <div style={{color: 'white'}}>Acesso restrito a Administradores.</div>;
  }

  return (
    <div style={{ color: 'var(--texto)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ color: 'var(--ouro)' }}>Comissão Técnica</h2>
      </div>

      <div className="card" style={{ marginBottom: 30 }}>
        <h3 style={{ marginBottom: 15 }}>{isEditing ? 'Editar Membro' : 'Cadastrar Novo Membro'}</h3>
        <form onSubmit={handleSalvar} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <label>Nome</label>
            <input type="text" value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} required />
          </div>
          <div>
            <label>Usuário de Login</label>
            <input type="text" value={form.usuario_lc} onChange={e => setForm({...form, usuario_lc: e.target.value})} required />
          </div>
          <div>
            <label>Senha {isEditing ? '(Deixe em branco para não alterar)' : 'Provisória'}</label>
            <input type="password" value={form.senha} onChange={e => setForm({...form, senha: e.target.value})} required={!isEditing} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label>Perfil</label>
            <select value={form.perfil} onChange={e => setForm({...form, perfil: e.target.value})}>
              <option value="Treinador">Treinador</option>
              <option value="Administrador">Administrador</option>
            </select>
          </div>
          
          {form.perfil === 'Treinador' && (
                          <div style={{ gridColumn: '1 / -1', background: 'rgba(255,255,255,0.05)', padding: 15, borderRadius: 8 }}>
                <label style={{ display: 'block', marginBottom: 10, color: 'var(--cinza)' }}>Categorias Responsáveis</label>
                <select 
                  className="input" 
                  value="" 
                  onChange={(e) => {
                    const id = parseInt(e.target.value, 10);
                    if (!id) return;
                    if (!form.categorias.includes(id)) {
                        handleCheckbox(id);
                    }
                  }}
                  style={{ marginBottom: 10, width: '100%', padding: '10px', background: 'rgba(0,0,0,0.5)', color: '#fff', border: '1px solid var(--linha)', borderRadius: '6px' }}
                >
                  <option value="">Selecione uma categoria para adicionar...</option>
                  {allCategorias.filter(c => !form.categorias.includes(c.id)).map(c => (
                    <option key={c.id} value={c.id}>{c.nome}</option>
                  ))}
                </select>
                
                {form.categorias.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: '10px 0' }}>
                    {form.categorias.map(id => {
                      const cat = allCategorias.find(c => c.id === id);
                      const catName = cat ? cat.nome : 'Desconhecida';
                      return (
                        <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(248, 193, 70, 0.2)', border: '1px solid var(--ouro)', color: 'var(--ouro)', padding: '6px 12px', borderRadius: 20, fontSize: 13, fontWeight: 'bold' }}>
                          {catName}
                          <X 
                            size={14} 
                            style={{ cursor: 'pointer', opacity: 0.8 }} 
                            onClick={() => handleCheckbox(id)} 
                            onMouseEnter={e => e.target.style.opacity = 1}
                            onMouseLeave={e => e.target.style.opacity = 0.8}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
          )}

          <div style={{ gridColumn: '1 / -1' }}>
            <button type="submit" className="btn btn-primary">{isEditing ? 'Salvar Alterações' : 'Salvar'}</button>
            {isEditing && <button type="button" className="btn btn-danger" style={{ marginLeft: 10 }} onClick={() => { setIsEditing(false); setForm({ id: null, nome: '', usuario_lc: '', senha: '', perfil: 'Treinador', categorias: [] }); }}>Cancelar</button>}
          </div>
        </form>
      </div>

      <div className="card">
        <table>
          <thead><tr><th>Nome</th><th>Usuário</th><th>Perfil</th><th>Categorias</th><th>Ações</th></tr></thead>
          <tbody>
            {treinadores.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center' }}>Nenhum treinador cadastrado.</td></tr>
            ) : (
              treinadores.map(t => (
                <tr key={t.id}>
                  <td>{t.nome}</td>
                  <td>{t.usuario_lc}</td>
                  <td>{t.perfil}</td>
                  <td>{t.categorias ? t.categorias.map(c => c.nome).join(', ') : '-'}</td>
                  <td>
                    <button className="btn btn-primary" style={{ marginRight: 10 }} onClick={() => handleEditar(t)}><Edit2 size={16} /></button>
                    <button className="btn btn-danger" onClick={() => handleExcluir(t.id)}><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

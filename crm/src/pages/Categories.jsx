import React, { useState, useEffect, useContext } from 'react';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import { Trash2 } from 'lucide-react';

export default function Categories() {
  const { user } = useContext(AuthContext);
  const [categorias, setCategorias] = useState([]);
  const [nome, setNome] = useState('');

  useEffect(() => {
    carregarCategorias();
  }, []);

  const carregarCategorias = async () => {
    try {
      const res = await api.get('/api/admin/categorias');
      setCategorias(res.data.categorias);
    } catch (e) { alert('Erro ao carregar'); }
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/admin/categorias', { nome });
      setNome('');
      carregarCategorias();
    } catch (e) { alert('Erro ao salvar'); }
  };

  const handleExcluir = async (id) => {
    if (!window.confirm('Tem certeza? Isso pode afetar atletas desta categoria.')) return;
    try {
      await api.delete(`/api/admin/categorias/${id}`);
      carregarCategorias();
    } catch (e) { alert('Erro ao excluir'); }
  };

  if (user?.perfil !== 'Administrador' && user?.perfil !== 'admin') {
    return <div style={{ color: 'white' }}>Acesso Negado</div>;
  }

  return (
    <div style={{ color: 'var(--texto)' }}>
      <h2 style={{ color: 'var(--ouro)', marginBottom: 20 }}>Categorias do Clube</h2>
      <div className="card" style={{ marginBottom: 30 }}>
        <form onSubmit={handleSalvar} style={{ display: 'flex', gap: 10, alignItems: 'end' }}>
          <div style={{ flex: 1 }}>
            <label>Nova Categoria</label>
            <input type="text" value={nome} onChange={e => setNome(e.target.value)} required placeholder="Ex: Sub-18" />
          </div>
          <button type="submit" className="btn btn-primary">Adicionar</button>
        </form>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {categorias.length === 0 ? (
           <div className="card" style={{ textAlign: 'center', gridColumn: '1 / -1' }}>Nenhuma categoria cadastrada.</div>
        ) : (
          categorias.map(c => (
            <div className="card" key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px' }}>
              <div>
                <span style={{ color: 'var(--cinza)', fontSize: '0.8rem' }}>ID: {c.id}</span>
                <h3 style={{ margin: '5px 0 0 0', color: 'var(--ouro)', fontSize: '1.2rem' }}>{c.nome}</h3>
              </div>
              <button className="btn" style={{ padding: '8px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)' }} onClick={() => handleExcluir(c.id)}><Trash2 size={16}/></button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

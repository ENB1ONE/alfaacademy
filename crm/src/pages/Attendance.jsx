import { useState, useEffect } from 'react';
import api from '../api';
import { Save } from 'lucide-react';

export default function Attendance() {
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [atletas, setAtletas] = useState([]);
  const [presencas, setPresencas] = useState({});
  const [titulo, setTitulo] = useState('Treino Regular');
  const [tipo, setTipo] = useState('TREINO');

  
  const loadCategorias = async () => {
    try {
      const res = await api.get('/api/admin/categorias');
      const cats = res.data.categorias || res.data;
      setCategorias(cats);
      if (cats.length > 0 && categoriasSelecionadas.length === 0) setCategoriasSelecionadas([String(cats[0].id)]);
    } catch (e) { console.error(e); }
  };

  const loadAtletas = async () => {
    try {
      const res = await api.get('/api/admin/atletas');
      const list = Array.isArray(res.data) ? res.data : (res.data?.atletas || []);
      
      const filtrados = list.filter(a => categoriasSelecionadas.includes(String(a.categoria_id)));
      
      const athletesWithCat = filtrados.map(a => {
         const c = categorias.find(cat => String(cat.id) === String(a.categoria_id));
         return { ...a, categoria_nome: c ? c.nome : '' };
      });
      // Sort athletes by name
      athletesWithCat.sort((a,b) => (a.nome||'').localeCompare(b.nome||''));
      
      setAtletas(athletesWithCat);
      
      const obj = {};
      athletesWithCat.forEach(a => { obj[a.id] = true; });
      setPresencas(obj);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => { loadCategorias(); }, []);
  useEffect(() => { loadAtletas(); }, [categoriasSelecionadas, categorias]);

  const handleSave = async () => {
    try {
      const promises = categoriasSelecionadas.map(catId => {
          const payload = atletas.filter(a => String(a.categoria_id) === String(catId)).map(a => ({
            atleta_id: a.id,
            presente: presencas[a.id]
          }));
          if (payload.length > 0) {
              return api.post('/api/admin/chamadas', { categoria_id: catId, presencas: payload, titulo, tipo });
          }
          return Promise.resolve();
      });
      await Promise.all(promises);
      alert('Listas de chamada salvas com sucesso!');
    } catch (e) {
      alert('Erro ao salvar listas de chamada. Verifique se o servidor suporta esta função.');
    }
  };

  return (
    <div>
      <h1 style={{ color: 'var(--ouro)', marginBottom: 10 }}>Lista de Chamada Oficial</h1>
      <p style={{ color: 'var(--cinza)', marginBottom: 20 }}>Selecione as categorias para realizar a chamada em lote.</p>
      
      <div className="card" style={{ padding: 20, marginBottom: 20 }}>
        <label style={{ display: 'block', marginBottom: 15, color: 'var(--cinza)', fontSize: 14 }}>Categorias Envolvidas (Múltipla Seleção)</label>
        {categorias.length === 0 && <span style={{ color: 'var(--cinza)' }}>Carregando...</span>}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {categorias.map(cat => {
                const isSel = categoriasSelecionadas.includes(String(cat.id));
                return (
                    <span 
                        key={cat.id} 
                        onClick={() => {
                            if(isSel) setCategoriasSelecionadas(categoriasSelecionadas.filter(id => id !== String(cat.id)));
                            else setCategoriasSelecionadas([...categoriasSelecionadas, String(cat.id)]);
                        }}
                        style={{ 
                            padding: '8px 16px', borderRadius: 20, 
                            border: '1px solid var(--ouro)', 
                            background: isSel ? 'var(--ouro)' : 'transparent', 
                            color: isSel ? '#000' : 'var(--ouro)', 
                            cursor: 'pointer', fontWeight: 'bold', fontSize: 14 
                        }}>
                        {cat.nome}
                    </span>
                );
            })}
        </div>
      </div>

      <div className="card" style={{ padding: '20px', marginBottom: 20, display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 200px' }}>
              <label style={{ display: 'block', marginBottom: 5, color: 'var(--cinza)', fontSize: 14 }}>Título do Evento</label>
              <input type="text" value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="Ex: Amistoso" style={{ margin: 0 }} />
          </div>
          <div style={{ flex: '1 1 200px' }}>
              <label style={{ display: 'block', marginBottom: 5, color: 'var(--cinza)', fontSize: 14 }}>Tipo</label>
              <select value={tipo} onChange={e => setTipo(e.target.value)} style={{ margin: 0 }}>
                  <option value="TREINO">Treino</option>
                  <option value="JOGO">Jogo Oficial</option>
                  <option value="AVALIACAO">Avaliação Física</option>
              </select>
          </div>
      </div>

      <div className="card" style={{ padding: '0 20px 20px 20px' }}>
        {atletas.length === 0 ? (
          <p style={{ padding: 20, textAlign: 'center', color: 'var(--cinza)' }}>Nenhum atleta nestas categorias.</p>
        ) : (
          <div className="table-container">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr><th style={{ textAlign: 'left', padding: 15, borderBottom: '1px solid var(--linha)', color: 'var(--cinza)' }}>Atleta</th><th style={{ textAlign: 'center', padding: 15, borderBottom: '1px solid var(--linha)', color: 'var(--cinza)' }}>Presente?</th></tr>
            </thead>
            <tbody>
              {atletas.map(a => (
                <tr key={a.id}>
                  <td style={{ padding: 15, borderBottom: '1px solid var(--linha)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <strong>{a.nome}</strong>
                        <span style={{ fontSize: 11, background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: 10, color: 'var(--cinza)' }}>
                            {a.categoria_nome || 'Categoria'}
                        </span>
                    </div>
                  </td>
                  <td style={{ padding: 15, borderBottom: '1px solid var(--linha)', textAlign: 'center' }}>
                    <input type="checkbox" checked={presencas[a.id]} onChange={e => setPresencas({...presencas, [a.id]: e.target.checked})} style={{ width: 24, height: 24, accentColor: 'var(--ouro)' }} />
                  </td>
                </tr>
              ))}
            </tbody>
            </table>
          </div>
        )}
        {atletas.length > 0 && (
          <button onClick={handleSave} className="btn" style={{ width: '100%', marginTop: 20, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
            <Save size={20} /> Salvar Chamada
          </button>
        )}
      </div>
    </div>
  );
}

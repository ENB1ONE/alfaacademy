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
  const [dataChamada, setDataChamada] = useState(new Date().toISOString().split('T')[0]);

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
      
      // Todos desmarcados por padrão (false) para que o professor/treinador marque apenas os presentes
      const obj = {};
      athletesWithCat.forEach(a => {
        obj[a.id] = false;
      });
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
            presente: !!presencas[a.id]
          }));
          if (payload.length > 0) {
              return api.post('/api/admin/chamadas', { categoria_id: catId, presencas: payload, titulo, tipo, data: dataChamada });
          }
          return Promise.resolve();
      });
      await Promise.all(promises);
      alert('Listas de chamada salvas com sucesso!');
      setCategoriasSelecionadas([]);
      setTitulo('Treino Regular');
      setTipo('TREINO');
      setPresencas({});
    } catch (e) {
      alert('Erro ao salvar listas de chamada. Verifique se o servidor suporta esta função.');
    }
  };

  const marcarTodos = () => {
    const obj = {};
    atletas.forEach(a => { obj[a.id] = true; });
    setPresencas(obj);
  };

  const desmarcarTodos = () => {
    const obj = {};
    atletas.forEach(a => { obj[a.id] = false; });
    setPresencas(obj);
  };

  const totalPresentes = atletas.filter(a => presencas[a.id]).length;

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
          <div style={{ flex: '1 1 200px' }}>
              <label style={{ display: 'block', marginBottom: 5, color: 'var(--cinza)', fontSize: 14 }}>Data da Chamada (Retroativa)</label>
              <input type="date" value={dataChamada} onChange={e => setDataChamada(e.target.value)} style={{ margin: 0 }} />
          </div>
      </div>

      <div className="card" style={{ padding: '0 20px 20px 20px' }}>
        {atletas.length === 0 ? (
          <p style={{ padding: 20, textAlign: 'center', color: 'var(--cinza)' }}>Nenhum atleta nestas categorias.</p>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginTop: 20, marginBottom: 15, paddingBottom: 10, borderBottom: '1px solid var(--linha)' }}>
              <span style={{ color: 'var(--cinza)', fontSize: 14 }}>
                Presentes: <strong style={{ color: 'var(--ouro)' }}>{totalPresentes}</strong> de {atletas.length}
              </span>
              <div style={{ display: 'flex', gap: 10 }}>
                <button 
                  type="button" 
                  onClick={marcarTodos} 
                  style={{ 
                    background: 'transparent', 
                    border: '1px solid var(--linha)', 
                    color: 'var(--texto)', 
                    padding: '6px 12px', 
                    borderRadius: 'var(--radius-sm)', 
                    cursor: 'pointer', 
                    fontSize: 13 
                  }}>
                  Marcar Todos
                </button>
                <button 
                  type="button" 
                  onClick={desmarcarTodos} 
                  style={{ 
                    background: 'transparent', 
                    border: '1px solid var(--linha)', 
                    color: 'var(--cinza)', 
                    padding: '6px 12px', 
                    borderRadius: 'var(--radius-sm)', 
                    cursor: 'pointer', 
                    fontSize: 13 
                  }}>
                  Desmarcar Todos
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '15px' }}>
              {atletas.map(a => {
                const isChecked = !!presencas[a.id];
                return (
                  <div 
                    key={a.id} 
                    onClick={() => setPresencas(prev => ({ ...prev, [a.id]: !prev[a.id] }))}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between', 
                      padding: '15px', 
                      background: isChecked ? 'rgba(248, 193, 70, 0.08)' : 'rgba(255,255,255,0.02)', 
                      border: isChecked ? '1px solid var(--ouro)' : '1px solid var(--linha)', 
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      userSelect: 'none',
                      transition: 'all 0.15s ease'
                    }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <strong style={{ fontSize: '1.1rem', color: isChecked ? 'var(--ouro)' : 'var(--texto)' }}>{a.nome}</strong>
                        <span style={{ fontSize: '0.8rem', background: 'rgba(248, 193, 70, 0.1)', color: 'var(--ouro)', padding: '2px 8px', borderRadius: '10px', width: 'fit-content' }}>
                            {a.categoria_nome || 'Categoria'}
                        </span>
                    </div>
                    <div>
                      <input 
                        type="checkbox" 
                        checked={isChecked} 
                        onChange={e => {
                          e.stopPropagation();
                          setPresencas(prev => ({ ...prev, [a.id]: e.target.checked }));
                        }} 
                        style={{ width: 28, height: 28, accentColor: 'var(--ouro)', cursor: 'pointer' }} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
        {atletas.length > 0 && (
          <button onClick={handleSave} className="btn" style={{ width: '100%', marginTop: 20, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
            <Save size={20} /> Salvar Chamada ({totalPresentes} presentes)
          </button>
        )}
      </div>
    </div>
  );
}

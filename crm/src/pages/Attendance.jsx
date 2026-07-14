import { useState, useEffect } from 'react';
import api from '../api';
import { Save } from 'lucide-react';

export default function Attendance() {
  const [categoria, setCategoria] = useState('Sub-15');
  const [atletas, setAtletas] = useState([]);
  const [presencas, setPresencas] = useState({});

  const loadAtletas = async () => {
    try {
      const res = await api.get('/api/admin/atletas');
      const list = Array.isArray(res.data) ? res.data : (res.data?.atletas || []);
      const filtrados = list.filter(a => a.categoria === categoria);
      setAtletas(filtrados);
      
      const obj = {};
      filtrados.forEach(a => { obj[a.id] = true; });
      setPresencas(obj);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => { loadAtletas(); }, [categoria]);

  const handleSave = async () => {
    try {
      const payload = atletas.map(a => ({
        atleta_id: a.id,
        presente: presencas[a.id]
      }));
      await api.post('/api/admin/chamadas', { categoria, presencas: payload });
      alert('Lista de chamada salva com sucesso!');
    } catch (e) {
      alert('Erro ao salvar lista de chamada. Verifique se o servidor suporta esta função.');
    }
  };

  const btnStyle = (cat) => ({
    padding: '8px 16px', borderRadius: 8, background: categoria === cat ? 'var(--ouro)' : 'transparent',
    color: categoria === cat ? '#000' : 'var(--ouro)', border: '1px solid var(--ouro)', cursor: 'pointer'
  });

  return (
    <div>
      <h1 style={{ color: 'var(--ouro)', marginBottom: 10 }}>Lista de Chamada Oficial</h1>
      <p style={{ color: 'var(--cinza)', marginBottom: 20 }}>Selecione a categoria para realizar a chamada do dia.</p>
      
      <div style={{ display: 'flex', gap: 10, marginBottom: 30 }}>
        {['Sub-11', 'Sub-13', 'Sub-15', 'Sub-17', 'Sub-20'].map(cat => (
          <button key={cat} onClick={() => setCategoria(cat)} style={btnStyle(cat)}>{cat}</button>
        ))}
      </div>

      <div className="card" style={{ padding: '0 20px 20px 20px' }}>
        {atletas.length === 0 ? (
          <p style={{ padding: 20, textAlign: 'center', color: 'var(--cinza)' }}>Nenhum atleta nesta categoria.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20 }}>
            <thead>
              <tr><th style={{ textAlign: 'left', padding: 15, borderBottom: '1px solid var(--linha)', color: 'var(--cinza)' }}>Atleta</th><th style={{ textAlign: 'center', padding: 15, borderBottom: '1px solid var(--linha)', color: 'var(--cinza)' }}>Presente?</th></tr>
            </thead>
            <tbody>
              {atletas.map(a => (
                <tr key={a.id}>
                  <td style={{ padding: 15, borderBottom: '1px solid var(--linha)' }}><strong>{a.nome}</strong></td>
                  <td style={{ padding: 15, borderBottom: '1px solid var(--linha)', textAlign: 'center' }}>
                    <input type="checkbox" checked={presencas[a.id]} onChange={e => setPresencas({...presencas, [a.id]: e.target.checked})} style={{ width: 24, height: 24, accentColor: 'var(--ouro)' }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {atletas.length > 0 && (
          <button onClick={handleSave} className="btn" style={{ width: '100%', marginTop: 20, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
            <Save size={20} /> Salvar Chamada do {categoria}
          </button>
        )}
      </div>
    </div>
  );
}

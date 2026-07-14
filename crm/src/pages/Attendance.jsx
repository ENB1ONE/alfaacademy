import { useState, useEffect } from 'react';
import api from '../api';
import { Check, X, UserMinus, Activity } from 'lucide-react';

export default function Attendance() {
  const [atletas, setAtletas] = useState([]);
  const [categoria, setCategoria] = useState('Sub-15');

  useEffect(() => {
    carregarAtletas();
  }, [categoria]);

  const carregarAtletas = async () => {
    try {
      const res = await api.get('/api/admin/atletas');
      const filtrados = res.data.filter(a => a.categoria === categoria);
      setAtletas(filtrados.map(a => ({ ...a, presencaStatus: null })));
    } catch (e) {
      console.error(e);
    }
  };

  const handleStatus = (id, status) => {
    setAtletas(atletas.map(a => a.id === id ? { ...a, presencaStatus: status } : a));
  };

  const submitChamada = async () => {
    // Aqui seria enviada a lista para a API
    alert('Chamada registrada com sucesso para o ' + categoria + '!');
  };

  return (
    <div>
      <h1 style={{ color: 'var(--ouro)' }}>Lista de Chamada Oficial</h1>
      <p style={{ color: 'var(--cinza)', marginBottom: 30 }}>Marque a frequAancia no próprio campo pelo celular.</p>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        {['Sub-11', 'Sub-13', 'Sub-15', 'Sub-17', 'Sub-20'].map(cat => (
          <button key={cat} onClick={() => setCategoria(cat)} className={`btn ${categoria !== cat ? 'outline' : ''}`} style={{ padding: '8px 16px' }}>
            {cat}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gap: 15 }}>
        {atletas.length === 0 ? <p>Nenhum atleta nesta categoria.</p> : null}
        {atletas.map(a => (
          <div key={a.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px' }}>
            <div>
              <strong style={{ display: 'block', fontSize: 18 }}>{a.nome}</strong>
              <span style={{ color: 'var(--cinza)', fontSize: 14 }}>Posição: {a.posicao}</span>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => handleStatus(a.id, 'Presente')} style={{ padding: 10, borderRadius: 8, background: a.presencaStatus === 'Presente' ? '#22c55e' : 'rgba(255,255,255,0.1)', color: '#fff' }}><Check size={20}/></button>
              <button onClick={() => handleStatus(a.id, 'Faltou')} style={{ padding: 10, borderRadius: 8, background: a.presencaStatus === 'Faltou' ? '#ef4444' : 'rgba(255,255,255,0.1)', color: '#fff' }}><X size={20}/></button>
              <button onClick={() => handleStatus(a.id, 'Justificado')} title="Falta Justificada" style={{ padding: 10, borderRadius: 8, background: a.presencaStatus === 'Justificado' ? '#eab308' : 'rgba(255,255,255,0.1)', color: '#fff' }}><UserMinus size={20}/></button>
              <button onClick={() => handleStatus(a.id, 'Lesionado')} title="Lesionado/DM" style={{ padding: 10, borderRadius: 8, background: a.presencaStatus === 'Lesionado' ? '#a855f7' : 'rgba(255,255,255,0.1)', color: '#fff' }}><Activity size={20}/></button>
            </div>
          </div>
        ))}
      </div>

      <button onClick={submitChamada} className="btn" style={{ marginTop: 30, width: '100%', padding: 20, fontSize: 18 }}>Confirmar Presenças do {categoria}</button>
    </div>
  );
}

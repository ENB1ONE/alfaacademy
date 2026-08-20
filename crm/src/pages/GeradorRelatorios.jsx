import React, { useState } from 'react';
import { Download, Search, Filter } from 'lucide-react';

export default function GeradorRelatorios() {
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [tipo, setTipo] = useState('Geral');
  const [isLoading, setIsLoading] = useState(false);

  const handleGerar = () => {
    setIsLoading(true);
    setTimeout(() => {
        setIsLoading(false);
        alert('Relatório consolidado! No futuro, isso acionará a API de relatórios.');
    }, 1500);
  };

  return (
    <div style={{ color: 'var(--texto)', maxWidth: 800, margin: '0 auto' }}>
      <h1 style={{ color: 'var(--ouro)', marginBottom: 10 }}>Gerador de Relatórios</h1>
      <p style={{ color: 'var(--cinza)', marginBottom: 30 }}>Exporte relatórios em PDF com intervalo de datas para atletas ou categorias.</p>

      <div className="card" style={{ padding: '30px' }}>
        <h4 style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, color: 'var(--ouro)' }}><Filter size={18} /> Parâmetros do Relatório</h4>
        
        <div style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
            <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: 8, color: 'var(--cinza)' }}>Data Início</label>
                <input type="date" className="input" value={dataInicio} onChange={e => setDataInicio(e.target.value)} style={{ width: '100%' }} />
            </div>
            <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: 8, color: 'var(--cinza)' }}>Data Fim</label>
                <input type="date" className="input" value={dataFim} onChange={e => setDataFim(e.target.value)} style={{ width: '100%' }} />
            </div>
        </div>

        <div style={{ marginBottom: 30 }}>
            <label style={{ display: 'block', marginBottom: 8, color: 'var(--cinza)' }}>Tipo de Relatório</label>
            <select className="input" value={tipo} onChange={e => setTipo(e.target.value)} style={{ width: '100%' }}>
                <option value="Geral">Assiduidade Geral Clube</option>
                <option value="Categoria">Por Categoria</option>
                <option value="Individual">Atleta Individual</option>
            </select>
        </div>

        <button className="btn primary" onClick={handleGerar} disabled={isLoading || !dataInicio || !dataFim} style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: 10 }}>
            {isLoading ? "Processando..." : <><Search size={18}/> Processar Relatório</>}
        </button>
      </div>
    </div>
  );
}

const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/Overview.jsx', 'utf8');

// Loading state
const loadingOld = `        {loading ? (
          <div style={{ color: 'var(--cinza)' }}>Carregando...</div>
        ) : (`;
const loadingNew = `        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
              {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 120 }}></div>)}
          </div>
        ) : (`;
code = code.replace(loadingOld, loadingNew);

// Empty State for Próximos Jogos
const emptyOld = `        {proximosJogos.length === 0 ? (
            <p style={{ margin: 0, color: 'var(--cinza)' }}>Nenhum jogo agendado para os próximos dias.</p>
        ) : (`;
const emptyNew = `        {proximosJogos.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#999', margin: '30px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                <Trophy size={40} style={{ opacity: 0.15 }} />
                <span>Nenhum jogo agendado para os próximos dias.</span>
            </div>
        ) : (`;
code = code.replace(emptyOld, emptyNew);

fs.writeFileSync('crm/src/pages/Overview.jsx', code, 'utf8');
console.log("Overview updated.");

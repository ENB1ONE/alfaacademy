const fs = require('fs');
let staffFile = fs.readFileSync('crm/src/pages/Staff.jsx', 'utf8');

const listStart = `<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>`;

const filterUI = `
      <div className="card" style={{ padding: 20, marginBottom: 30 }}>
        <h4 style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 15, color: 'var(--ouro)' }}><Filter size={18} /> Filtros Inteligentes</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
          <div>
            <label style={{ fontSize: 12, color: 'var(--cinza)' }}>Buscar por Nome/Usuário</label>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: 10, top: 12, color: 'var(--cinza)' }} />
              <input type="text" className="input" placeholder="Digite para buscar..." value={busca} onChange={(e) => setBusca(e.target.value)} style={{ width: '100%', paddingLeft: 35, marginTop: 0 }} />
            </div>
          </div>
          <div>
            <label style={{ fontSize: 12, color: 'var(--cinza)' }}>Perfil</label>
            <select className="input" value={filtroPerfil} onChange={(e) => setFiltroPerfil(e.target.value)} style={{ width: '100%', marginTop: 0 }}>
              <option value="">Todos os Perfis</option>
              <option value="Administrador">Administrador</option>
              <option value="Treinador">Treinador</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
`;

// Insert only if it hasn't been inserted
if (!staffFile.includes("Filtros Inteligentes")) {
    staffFile = staffFile.replace(listStart, filterUI);
}

// Fix the ?. operator in matchBusca just in case!
staffFile = staffFile.replace(
    "t.nome.toLowerCase().includes",
    "(t.nome || '').toLowerCase().includes"
);
staffFile = staffFile.replace(
    "t.usuario_lc.toLowerCase().includes",
    "(t.usuario_lc || '').toLowerCase().includes"
);

fs.writeFileSync('crm/src/pages/Staff.jsx', staffFile, 'utf8');

// Fix Athletes.jsx crash!
let athletesFile = fs.readFileSync('crm/src/pages/Athletes.jsx', 'utf8');
athletesFile = athletesFile.replace(
    "a.nome.toLowerCase().includes(busca.toLowerCase());",
    "(a.nome || '').toLowerCase().includes(busca.toLowerCase());"
);

fs.writeFileSync('crm/src/pages/Athletes.jsx', athletesFile, 'utf8');

console.log('Fixed files');

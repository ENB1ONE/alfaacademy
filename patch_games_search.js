const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/Games.jsx', 'utf8');

// 1. Add filtered array logic
const renderStart = "  return (\n    <div>";
code = code.replace(
    renderStart,
    "  const filteredJogos = jogos.filter(j => (j.adversario || '').toLowerCase().includes(searchTerm.toLowerCase()));\n\n" + renderStart
);

// 2. Add search bar UI
const headerEnd = `          {isAdmin && (
            <button className="btn primary" onClick={openCreateModal} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Plus size={20} /> Agendar Jogo
            </button>
          )}
        </div>`;

const searchUi = `
        <div className="card" style={{ padding: 20, marginBottom: 30 }}>
          <h4 style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 15, color: 'var(--ouro)' }}><Search size={18} /> Filtro de Pesquisa</h4>
          <div>
            <div style={{ position: 'relative' }}>
               <Search size={16} style={{ position: 'absolute', top: 12, left: 10, color: 'var(--cinza)' }} />
               <input type="text" placeholder="Buscar por adversário ou título..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ marginTop: 0, paddingLeft: 35, marginBottom: 0, width: '100%' }} className="input" />
            </div>
          </div>
        </div>`;

code = code.replace(headerEnd, headerEnd + searchUi);

// 3. Replace map
code = code.replace(/jogos\.length === 0/g, "filteredJogos.length === 0");
code = code.replace(/jogos\.map/g, "filteredJogos.map");

fs.writeFileSync('crm/src/pages/Games.jsx', code, 'utf8');

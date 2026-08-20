const fs = require('fs');

let code = fs.readFileSync('crm/src/pages/Games.jsx', 'utf8');

// Fix mojibake
code = code.replace(/Jogos \& Convoca.*?es/g, 'Jogos & Convocações');
code = code.replace(/Gerencie os pr.*?ximos/g, 'Gerencie os próximos');

// Add search filter UI
const headerEnd = `          {isAdmin && (
            <button className="btn primary" onClick={openCreateModal} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Plus size={18} /> Agendar Jogo
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

if (!code.includes('Filtro de Pesquisa')) {
    code = code.replace(headerEnd, headerEnd + searchUi);
}

fs.writeFileSync('crm/src/pages/Games.jsx', code, 'utf8');

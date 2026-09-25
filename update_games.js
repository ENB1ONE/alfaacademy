const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/Games.jsx', 'utf8');

// 1. Loading State (Skeletons)
const loadingOld = `        {loading ? (
          <div style={{ color: 'var(--cinza)' }}>Carregando...</div>
        ) : filteredJogos.length === 0 ? (`;
const loadingNew = `        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', width: '100%' }}>
              {[1, 2, 3].map(i => (
                  <div key={i} className="skeleton" style={{ height: 180, width: '100%' }}></div>
              ))}
          </div>
        ) : filteredJogos.length === 0 ? (`;
code = code.replace(loadingOld, loadingNew);

// 2. Empty State (Standardized)
const emptyOld = `          <div style={{ color: 'var(--cinza)' }}>Nenhum jogo encontrado.</div>`;
// Import FileText if not imported? Let's check imports.
const emptyNew = `          <div style={{ textAlign: 'center', color: '#999', margin: '40px auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 15 }}>
                                <Trophy size={48} style={{ opacity: 0.2 }} />
                                <span style={{ fontSize: 16 }}>Nenhum jogo encontrado para os filtros atuais.</span>
                            </div>`;
code = code.replace(emptyOld, emptyNew);

// 3. Dynamic Search Input
const searchOld = `             <Search size={16} style={{ position: 'absolute', top: 12, left: 10, color: 'var(--cinza)' }} />
             <input type="text" placeholder="Ex: Flamengo, 23/08, SUB15..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ marginTop: 0, paddingLeft: 35, marginBottom: 0, width: '100%' }} className="input" />
          </div>`;
const searchNew = `             <Search size={16} style={{ position: 'absolute', top: 12, left: 10, color: 'var(--cinza)' }} />
             <input type="text" placeholder="Ex: Flamengo, 23/08, SUB15..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ marginTop: 0, paddingLeft: 35, paddingRight: 35, marginBottom: 0, width: '100%' }} className="input" />
             {searchTerm && (
                <button className="clear-search-btn" onClick={() => setSearchTerm('')} title="Limpar Busca">
                    <X size={14} />
                </button>
             )}
          </div>`;

code = code.replace(searchOld, searchNew);

// We need to import X from lucide-react in Games.jsx!
if (code.includes('import {') && !code.includes(' X ')) {
    code = code.replace('import {', 'import { X, ');
}

fs.writeFileSync('crm/src/pages/Games.jsx', code, 'utf8');
console.log("Games updated.");

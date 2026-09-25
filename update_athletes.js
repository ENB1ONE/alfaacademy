const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/Athletes.jsx', 'utf8');

// Loading state
const loadingOld = `      {loading ? (
        <div style={{ color: 'var(--cinza)' }}>Carregando...</div>
      ) : (`;
const loadingNew = `      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="skeleton" style={{ height: 180 }}></div>)}
        </div>
      ) : (`;
code = code.replace(loadingOld, loadingNew);

// Search Input
const searchOld = `             <Search size={16} style={{ position: 'absolute', top: 12, left: 10, color: 'var(--cinza)' }} />
             <input type="text" placeholder="Ex: Gabriel, Zagueiro, 2008..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ marginTop: 0, paddingLeft: 35, marginBottom: 0, width: '100%' }} className="input" />
          </div>`;
const searchNew = `             <Search size={16} style={{ position: 'absolute', top: 12, left: 10, color: 'var(--cinza)' }} />
             <input type="text" placeholder="Ex: Gabriel, Zagueiro, 2008..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ marginTop: 0, paddingLeft: 35, paddingRight: 35, marginBottom: 0, width: '100%' }} className="input" />
             {searchTerm && (
                <button className="clear-search-btn" onClick={() => setSearchTerm('')} title="Limpar Busca">
                    <X size={14} />
                </button>
             )}
          </div>`;
code = code.replace(searchOld, searchNew);

// Missing X import in Athletes?
if (code.includes('import {') && !code.includes(' X ')) {
    code = code.replace('import {', 'import { X, ');
}

fs.writeFileSync('crm/src/pages/Athletes.jsx', code, 'utf8');
console.log("Athletes updated.");

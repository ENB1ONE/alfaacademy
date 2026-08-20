const fs = require('fs');

let code = fs.readFileSync('crm/src/pages/Games.jsx', 'utf8');

// 1. Fix the search logic
const oldFilter = "const filteredJogos = jogos.filter(j => (j.adversario || '').toLowerCase().includes(searchTerm.toLowerCase()));";
const newFilter = `const filteredJogos = jogos.filter(j => {
    const termo = searchTerm.toLowerCase();
    const matchName = (j.adversario || '').toLowerCase().includes(termo);
    const matchDate = (j.data_raw || '').toLowerCase().includes(termo) || (j.data_formatada || '').toLowerCase().includes(termo);
    let matchCat = false;
    if (j.categorias_ids && categorias) {
        const catNomes = j.categorias_ids.map(cid => {
            const cat = categorias.find(c => c.id.toString() === cid.toString());
            return cat ? cat.nome.toLowerCase() : '';
        });
        matchCat = catNomes.some(n => n.includes(termo));
    }
    return matchName || matchDate || matchCat;
  });`;

code = code.replace(oldFilter, newFilter);

// 2. Inject search UI
const target = "{isAdmin && (\n          <button className=\"btn primary\" onClick={openCreateModal}";

const searchUi = `
      <div className="card" style={{ padding: 20, marginBottom: 30 }}>
        <h4 style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 15, color: 'var(--ouro)' }}><Search size={18} /> Filtro de Pesquisa</h4>
        <div>
          <label style={{ fontSize: 12, color: 'var(--cinza)' }}>Buscar por Título, Data ou Categoria</label>
          <div style={{ position: 'relative' }}>
             <Search size={16} style={{ position: 'absolute', top: 12, left: 10, color: 'var(--cinza)' }} />
             <input type="text" placeholder="Ex: Flamengo, 23/08, SUB15..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ marginTop: 0, paddingLeft: 35, marginBottom: 0, width: '100%' }} className="input" />
          </div>
        </div>
      </div>\n\n      `;

if (!code.includes('Filtro de Pesquisa')) {
    // Inject right before the <div className="card" style={{ padding: 20 }}> which holds the map
    code = code.replace('<div className="card" style={{ padding: 20 }}>', searchUi + '<div className="card" style={{ padding: 20 }}>');
}

fs.writeFileSync('crm/src/pages/Games.jsx', code, 'utf8');
console.log('Games patched.');

const fs = require('fs');

let content = fs.readFileSync('crm/src/pages/Athletes.jsx', 'utf8');

// Normalize newlines for safer replacement
content = content.replace(/\r\n/g, '\n');

// 1. Replace the filter logic
const filterRegex = /const list = rawList\.filter\(a => \{\n\s*let matchCat = true;\n\s*let matchTreinador = true;\n\s*let matchBusca = true;([\s\S]*?)return matchCat && matchTreinador && matchBusca;\n\s*\}\);/;

const newFilter = `const list = rawList.filter(a => {
      let matchCat = true;
      let matchTreinador = true;
      let matchBusca = true;
      let matchStatus = true;
$1
      if (filtroStatus) {
        matchStatus = a.status_medico === filtroStatus;
      }

      return matchCat && matchTreinador && matchBusca && matchStatus;
    });`;

if (filterRegex.test(content)) {
    content = content.replace(filterRegex, newFilter);
    console.log("Filter logic replaced successfully.");
} else {
    console.log("Failed to find filter logic block.");
}

// 2. Add Status Médico dropdown UI
const uiRegex = /<div>\n\s*<label style=\{\{ fontSize: 12, color: 'var\(--cinza\)' \}\}>Filtrar Categoria<\/label>\n\s*<select value=\{filtroCategoria\}[\s\S]*?<\/select>\n\s*<\/div>/;

const newUi = `<div>
              <label style={{ fontSize: 12, color: 'var(--cinza)' }}>Filtrar Categoria</label>
              <select value={filtroCategoria} onChange={e => setFiltroCategoria(e.target.value)} style={{ marginTop: 0, marginBottom: 0 }}>
                <option value="">Todas as Categorias</option>
                {categorias.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, color: 'var(--cinza)' }}>Status Médico</label>
              <select value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)} style={{ marginTop: 0, marginBottom: 0 }}>
                <option value="">Todos</option>
                <option value="Apto">Apto</option>
                <option value="Lesionado">Lesionado</option>
                <option value="Transição">Transição</option>
              </select>
            </div>`;

if (uiRegex.test(content)) {
    content = content.replace(uiRegex, newUi);
    console.log("UI block replaced successfully.");
} else {
    console.log("Failed to find UI block.");
}

// 3. Ensure useEffect uses "Lesionado"
content = content.replace(/setFiltroStatus\('Departamento MÃ©dico'\)/g, "setFiltroStatus('Lesionado')");
content = content.replace(/setFiltroStatus\('Departamento Médico'\)/g, "setFiltroStatus('Lesionado')");

fs.writeFileSync('crm/src/pages/Athletes.jsx', content, 'utf8');

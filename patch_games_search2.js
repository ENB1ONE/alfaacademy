const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/Games.jsx', 'utf8');

code = code.replace(
    /return \(\s*<div className="fade-in">/g,
    "const filteredJogos = jogos.filter(j => (j.adversario || '').toLowerCase().includes(searchTerm.toLowerCase()));\n  return (\n    <div className=\"fade-in\">"
);

fs.writeFileSync('crm/src/pages/Games.jsx', code, 'utf8');

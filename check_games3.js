const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/Games.jsx', 'utf8');
let idx = code.indexOf('jogos.map');
if (idx === -1) idx = code.indexOf('filteredJogos.map');
if (idx !== -1) console.log(code.substring(idx - 200, idx + 800));

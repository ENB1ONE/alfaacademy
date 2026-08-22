const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/PerfilAtleta.jsx', 'utf8');

code = code.replace(/Avaliação da IA/g, 'Avaliação de Desempenho');

fs.writeFileSync('crm/src/pages/PerfilAtleta.jsx', code, 'utf8');

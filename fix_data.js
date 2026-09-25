const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/Athletes.jsx', 'utf8');
code = code.replace(/row\.data_chamada/g, 'row.data_treino');
fs.writeFileSync('crm/src/pages/Athletes.jsx', code, 'utf8');
console.log("Replaced data_chamada with data_treino.");

const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');
let idx = code.indexOf('Construtor de Relatório');
console.log(code.substring(idx - 100, idx + 4000));

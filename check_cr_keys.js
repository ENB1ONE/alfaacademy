const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');
let idx = code.indexOf('Detalhamento de Frequência');
console.log(code.substring(idx, idx + 1000));

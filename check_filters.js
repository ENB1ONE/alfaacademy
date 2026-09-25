const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');
let idx = code.indexOf('Selecione o Módulo');
console.log(code.substring(idx - 200, idx + 2500));

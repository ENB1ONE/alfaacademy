const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');
let startIdx = code.indexOf("{/* Filtros Dinâmicos */}");
console.log(code.substring(startIdx, startIdx + 1500));

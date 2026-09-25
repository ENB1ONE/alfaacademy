const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');
let idx = code.indexOf('modulo === \'presencas\' && (');
let idx2 = code.indexOf('modulo === \'presencas\' && (', idx + 1);
console.log(code.substring(idx2 - 100, idx2 + 1500));

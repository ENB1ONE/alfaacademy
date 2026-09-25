const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');
let idx1 = code.indexOf('modulo === \'presencas\' && reportData');
console.log(code.substring(idx1, idx1 + 2500));

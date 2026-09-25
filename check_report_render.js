const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');
let idx = code.indexOf('modulo === \'presencas\' && reportData && (');
if(idx === -1) idx = code.indexOf('modulo === \'presencas\'');
console.log(code.substring(idx, idx + 1500));

const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');
let btnIdx = code.indexOf('onClick={handleGerarRelatorio}');
console.log(code.substring(btnIdx - 200, btnIdx + 200));

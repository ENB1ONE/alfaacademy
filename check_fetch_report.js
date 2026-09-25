const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');
let idx = code.indexOf('/api/admin/relatorios/');
console.log(code.substring(idx - 200, idx + 800));

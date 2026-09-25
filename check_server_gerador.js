const fs = require('fs');
let code = fs.readFileSync('backend/server.js', 'utf8');
let idx = code.indexOf('/api/admin/relatorios/gerador');
console.log(code.substring(idx, idx + 1500));

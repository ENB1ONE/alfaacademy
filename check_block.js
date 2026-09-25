const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');
let idx = code.indexOf("Atleta Específico");
console.log(code.substring(idx - 200, idx + 600));

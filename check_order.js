const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');
let idx = code.indexOf('<div style={{ display: \'flex\', gap: 20, flexWrap: \'wrap\', marginBottom: 20 }}>');
console.log(code.substring(idx, idx + 2000));

const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');
const lines = code.split('\n');
console.log(lines.slice(-20).join('\n'));

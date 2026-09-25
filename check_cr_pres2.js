const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');
let match = code.match(/filter\(r => r\.status === 'P'/);
let idx = code.indexOf(match[0]);
console.log(code.substring(idx + 1500, idx + 4000));

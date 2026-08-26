const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');
const lines = code.split('\n');
const errorLines = lines.filter(l => l.includes('<th className="" style={{ textAlign: "center", '));
console.log(errorLines.join('\n'));

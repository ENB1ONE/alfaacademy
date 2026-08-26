const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');

code = code.replace(/width: '100%',\s*minHeight: '1123px',/g, "minHeight: '1123px',");

fs.writeFileSync('crm/src/pages/CentralRelatorios.jsx', code, 'utf8');
console.log('Fixed width override in Dashboard.');

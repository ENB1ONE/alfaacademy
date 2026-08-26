const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');

code = code.replace(/windowWidth: 800/g, 'windowWidth: 1200');

fs.writeFileSync('crm/src/pages/CentralRelatorios.jsx', code, 'utf8');
console.log('windowWidth changed to 1200.');

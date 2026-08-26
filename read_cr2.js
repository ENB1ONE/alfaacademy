const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');
console.log(code.substring(code.indexOf('const [atletas'), code.indexOf('const [atletas') + 1000));

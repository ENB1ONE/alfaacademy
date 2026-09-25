const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');
const presencas = code.substring(code.indexOf("{modulo === 'presencas' && ("), code.indexOf(")}", code.indexOf("{modulo === 'presencas' && (")) + 2);
console.log(presencas);

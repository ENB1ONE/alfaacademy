const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/Overview.jsx', 'utf8');
const match = code.match(/proximosJogos[\s\S]{0,500}/);
console.log(match ? match[0] : 'Not found');

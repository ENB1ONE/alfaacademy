const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/Overview.jsx', 'utf8');
console.log(code.substring(code.indexOf('Próximos Jogos'), code.indexOf('Próximos Jogos') + 2000));

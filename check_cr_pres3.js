const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');
let idx = code.indexOf('modulo === \'jogos\' ? (');
let jogosEnd = code.indexOf(') : modulo === \'presencas\'', idx);
if(jogosEnd === -1) jogosEnd = code.indexOf(') : (', idx);
console.log(code.substring(jogosEnd - 100, jogosEnd + 2000));

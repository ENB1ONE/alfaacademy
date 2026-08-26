const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/Overview.jsx', 'utf8');
let start = code.indexOf('border-radius: 1'); // approximation
console.log(code.substring(code.indexOf('categorias_nomes.map'), code.indexOf('categorias_nomes.map') + 2000));

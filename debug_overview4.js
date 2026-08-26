const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/Overview.jsx', 'utf8');

console.log(code.substring(code.indexOf('return acc;'), code.indexOf('return acc;') + 500));

const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');
let btnIdx = code.indexOf('fetchGeneratorData');
console.log(code.substring(btnIdx - 400, btnIdx + 400));

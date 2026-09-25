const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');
let idx = code.indexOf('exportA4PDF = async');
console.log(code.substring(idx - 10, idx + 1000));

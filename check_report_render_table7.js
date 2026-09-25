const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');
let idx = code.indexOf('html2pdf().set(opt).from(element).save()');
console.log(code.substring(idx - 600, idx + 400));

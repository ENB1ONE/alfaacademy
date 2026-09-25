const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');
let m = code.match(/(const|function)\s+\w*PDF\w*[\s\S]{1,1000}html2pdf/);
if(m) console.log(m[0]);

const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');
let match = code.match(/\{modulo === 'presencas'[\s\S]{1,3000}table>/);
if(match) console.log(match[0].substring(match[0].length - 1500));
else console.log("Not found");

const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');
let idx = code.indexOf('<table');
if(idx > -1) {
    console.log(code.substring(idx - 200, idx + 2000));
}

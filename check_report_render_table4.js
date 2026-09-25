const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');
let idx1 = code.indexOf('Histórico de Presenças');
let idx2 = code.indexOf('Histórico de Presenças', idx1 + 1);
if(idx2 > -1) {
    console.log(code.substring(idx2 - 1000, idx2 + 3000));
}

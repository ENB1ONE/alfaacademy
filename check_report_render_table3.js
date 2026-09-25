const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');
let idx = code.indexOf('modulo === \'presencas\' && reportData && (');
if(idx === -1) {
    let match = code.match(/modulo === 'presencas'[\s\S]{1,500}table/);
    if(match) console.log(match[0]);
    else {
        // Let's just find the text "Histórico de Presenças"
        let i = code.indexOf('Histórico de Presenças');
        console.log(code.substring(i - 500, i + 3000));
    }
}

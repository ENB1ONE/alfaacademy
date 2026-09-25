const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');

let genIdx = code.indexOf("activeTab === 'generator' &&");
if (genIdx !== -1) {
    console.log(code.substring(genIdx, genIdx + 3000));
}

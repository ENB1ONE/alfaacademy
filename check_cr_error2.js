const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');
let lines = code.split('\n');
for(let i = 500; i < 650; i++) {
    if(lines[i] && lines[i].includes('activeTab === \'generator\' && (')) {
        console.log(`Found generator open at ${i+1}`);
    }
    if (i > 635) console.log(`${i+1}: ${lines[i]}`);
}

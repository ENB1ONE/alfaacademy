const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');

// Test if it contains the corrupted string
if (code.includes('RelatÃ³rios')) {
    let fixed = Buffer.from(code, 'latin1').toString('utf8');
    if (fixed.includes('Relatórios')) {
        console.log("Encoding fixed successfully in memory.");
        fs.writeFileSync('crm/src/pages/CentralRelatorios.jsx', fixed, 'utf8');
    } else {
        console.log("latin1 trick didn't work");
    }
} else {
    console.log("Did not find double-encoded string");
}

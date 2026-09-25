const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');
let lines = code.split('\n');
for(let i = 640; i <= 655; i++) {
    if (lines[i] !== undefined) console.log(`${i+1}: ${lines[i]}`);
}

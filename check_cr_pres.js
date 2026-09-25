const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');

// Find where we map for presencas:
// Let's search for "Detalhamento de Frequência" in CentralRelatorios
let idx = code.indexOf('Detalhamento de Frequência');
if (idx > -1) {
    console.log(code.substring(idx - 200, idx + 1500));
} else {
    // maybe we just search for P or Falta
    let match = code.match(/filter\(r => r\.status === 'P'/);
    if(match) {
        console.log("Found status check:");
        let idx2 = code.indexOf(match[0]);
        console.log(code.substring(idx2 - 200, idx2 + 1500));
    }
}

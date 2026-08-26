const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');
const lines = code.split('\n');

const btnIndex = lines.findIndex(l => l.includes('Gerar Visualização'));
if (btnIndex !== -1) {
    console.log(lines.slice(btnIndex - 5, btnIndex + 5).join('\n'));
}

const formIndex = lines.findIndex(l => l.includes('<form'));
console.log("Form tags found:", formIndex !== -1);

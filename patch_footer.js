const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');

// Replace the specific broken footer strings
code = code.replace(/Alfa Academy â€“ Formando Atletas e Cidadãos\./g, 'Alfa Academy - Formando Atletas e Cidadãos.');
code = code.replace(/prÃ©via/g, 'prévia');
code = code.replace(/Alfa Academy â€“/g, 'Alfa Academy -');

fs.writeFileSync('crm/src/pages/CentralRelatorios.jsx', code, 'utf8');
console.log('Fixed footer encoding.');

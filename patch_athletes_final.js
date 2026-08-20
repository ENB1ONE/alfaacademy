const fs = require('fs');

let code = fs.readFileSync('crm/src/pages/Athletes.jsx', 'utf8');

// Fix mojibake
code = code.replace(/Sem posi.*?o/g, 'Sem posição');
code = code.replace(/Status M.*?dico/g, 'Status Médico');
code = code.replace(/Nome do Respons.*?vel/g, 'Nome do Responsável');
code = code.replace(/Posi.*?o<\/label>/g, 'Posição</label>');

fs.writeFileSync('crm/src/pages/Athletes.jsx', code, 'utf8');

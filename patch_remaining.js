const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');

code = code.replace(/MÃ©dico/g, 'Médico');
code = code.replace(/PÃ© Dominante/g, 'Pé Dominante');
code = code.replace(/Ã s/g, 'às');
code = code.replace(/Ã /g, 'à');

fs.writeFileSync('crm/src/pages/CentralRelatorios.jsx', code, 'utf8');
console.log('Fixed remaining encoded characters.');

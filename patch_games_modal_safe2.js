const fs = require('fs');
let gam = fs.readFileSync('crm/src/pages/Games.jsx', 'utf8');

const startIndex = gam.lastIndexOf("<div>", gam.indexOf("Campeonato / Liga"));
const endIndex = gam.lastIndexOf("<div>", gam.indexOf("Categorias Participantes"));

if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
    gam = gam.substring(0, startIndex) + gam.substring(endIndex);
}

fs.writeFileSync('crm/src/pages/Games.jsx', gam, 'utf8');

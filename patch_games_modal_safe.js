const fs = require('fs');
let gam = fs.readFileSync('crm/src/pages/Games.jsx', 'utf8');

// Fix Modal Overflow
gam = gam.replace(
    /width: '100%', maxWidth: 500, padding: 30, position: 'relative'/g,
    "width: '100%', maxWidth: 500, padding: 30, position: 'relative', maxHeight: '90vh', overflowY: 'auto'"
);

// Remove optional fields using a robust regex block
const startStr = "<div>\n                <label style={{ display: 'block', marginBottom: 5, color: 'var(--cinza)' }}>Campeonato / Liga (Opcional)</label>";
const endStr = "<label style={{ display: 'block', marginBottom: 5, color: 'var(--cinza)' }}>Categorias Participantes</label>";

const startIndex = gam.indexOf(startStr);
const endIndex = gam.indexOf(endStr);

if (startIndex !== -1 && endIndex !== -1) {
    // Look backwards from endIndex to find the preceding <div>
    const beforeEnd = gam.lastIndexOf("<div>", endIndex);
    if (beforeEnd !== -1 && beforeEnd > startIndex) {
        gam = gam.substring(0, startIndex) + gam.substring(beforeEnd);
    }
}

fs.writeFileSync('crm/src/pages/Games.jsx', gam, 'utf8');

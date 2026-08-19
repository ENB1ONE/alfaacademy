const fs = require('fs');
let gam = fs.readFileSync('crm/src/pages/Games.jsx', 'utf8');

// Fix Modal Overflow
gam = gam.replace(
    /width: '100%', maxWidth: 500, padding: 30, position: 'relative'/g,
    "width: '100%', maxWidth: 500, padding: 30, position: 'relative', maxHeight: '90vh', overflowY: 'auto'"
);

// Remove optional fields
const lines = gam.split('\n');
let newLines = [];
let skip = false;
for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes("Campeonato / Liga (Opcional)")) {
        skip = true;
        // remove the previous <div>
        newLines.pop(); 
    }
    if (skip && line.includes("</textarea>")) {
        skip = false;
        // Skip the closing </div>
        i++;
        continue;
    }
    if (!skip) {
        newLines.push(line);
    }
}
gam = newLines.join('\n');
fs.writeFileSync('crm/src/pages/Games.jsx', gam, 'utf8');

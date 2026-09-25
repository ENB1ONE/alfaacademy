const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');

const moduloPresencasBlockRegex = /\{modulo === 'presencas' && \([\s\S]*?<div id="athlete-dropdown"[\s\S]*?<\/div>\s*<\/div>\s*\)\}/;

const matchPresencas = code.match(moduloPresencasBlockRegex);
if (!matchPresencas) {
    console.log("Could not find presencas block");
    process.exit(1);
}

let presencasBlock = matchPresencas[0];
// Update the background color and z-index to fix the visual bug
presencasBlock = presencasBlock.replace(/backgroundColor: 'var\(--fundo-card\)'/, "backgroundColor: '#111'");
presencasBlock = presencasBlock.replace(/zIndex: 100/, "zIndex: 9999");

// Remove the block from its current position
code = code.replace(moduloPresencasBlockRegex, '');

// Insert it right after {/* Filtros Dinâmicos */}
const insertPoint = code.indexOf("{/* Filtros Dinâmicos */}");
if (insertPoint === -1) {
    console.log("Could not find Filtros Dinâmicos");
    process.exit(1);
}

const before = code.substring(0, insertPoint + "{/* Filtros Dinâmicos */}".length);
const after = code.substring(insertPoint + "{/* Filtros Dinâmicos */}".length);

code = before + "\n" + presencasBlock + "\n" + after;

fs.writeFileSync('crm/src/pages/CentralRelatorios.jsx', code, 'utf8');
console.log('Successfully reordered and styled the autocomplete block.');

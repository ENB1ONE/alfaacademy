const fs = require('fs');
['crm/src/pages/Games.jsx', 'crm/src/pages/Athletes.jsx'].forEach(file => {
    let code = fs.readFileSync(file, 'utf8');
    code = code.replace(/import\s*\{\s*X,\s*/, 'import { ');
    fs.writeFileSync(file, code, 'utf8');
});
console.log("Imports fixed 2.");

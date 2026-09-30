const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/Athletes.jsx', 'utf8');
if (code.includes('const isAdmin =')) {
    console.log("isAdmin is defined.");
} else {
    console.log("isAdmin is NOT defined.");
}

let newAtletaIdx = code.indexOf('Novo Atleta');
if (newAtletaIdx !== -1) {
    console.log("Novo Atleta button found.");
    console.log(code.substring(newAtletaIdx - 200, newAtletaIdx + 200));
}

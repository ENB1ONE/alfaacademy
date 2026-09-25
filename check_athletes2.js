const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/Athletes.jsx', 'utf8');
let idx = code.indexOf('.map(atleta => (');
if(idx > -1) {
    console.log(code.substring(idx - 100, idx + 2000));
} else {
    console.log("Map not found");
}

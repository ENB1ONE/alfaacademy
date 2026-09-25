const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/Athletes.jsx', 'utf8');
let idx = code.indexOf('<div className="card"');
if(idx > -1) {
    console.log(code.substring(idx, idx + 1500));
} else {
    console.log("Card not found");
}

const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/Athletes.jsx', 'utf8');
let idx = code.indexOf('<Activity size=');
if(idx === -1) idx = code.indexOf('<Trash size=');
if(idx > -1) {
    console.log(code.substring(idx - 800, idx + 1000));
} else {
    console.log("Not found");
}

const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/Games.jsx', 'utf8');
let tIdx = code.indexOf('<table');
if (tIdx !== -1) console.log(code.substring(tIdx - 400, tIdx + 400));

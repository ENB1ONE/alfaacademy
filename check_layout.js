const fs = require('fs');
let code = fs.readFileSync('crm/src/components/Layout.jsx', 'utf8');
let start = code.indexOf('<NavLink to="/app/jogos"');
console.log(code.substring(start, start + 500));

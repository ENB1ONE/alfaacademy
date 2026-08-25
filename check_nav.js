const fs = require('fs');
let code = fs.readFileSync('crm/src/components/Layout.jsx', 'utf8');
const matches = code.match(/<NavLink.*?>/g);
console.log(matches);

const fs = require('fs');
let code = fs.readFileSync('crm/src/components/Layout.jsx', 'utf8');
console.log("Nav added:", code.includes('BOTTOM NAVIGATION (MOBILE)'));

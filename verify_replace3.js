const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');
console.log("Tabs applied:", code.includes("background: 'rgba(255,255,255,0.03)'"));

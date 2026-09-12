const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');
const options = code.match(/<option value="[a-z_]+">.*?<\/option>/g);
console.log(options);

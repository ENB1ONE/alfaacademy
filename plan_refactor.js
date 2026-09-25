const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');

let renderStart = code.indexOf('return (');
let genStart = code.indexOf("activeTab === 'generator' &&");
let genEnd = code.indexOf("{/* A4 Body (Table) */}");

console.log(code.substring(renderStart, genStart + 100));
console.log("...[skipping to generator]...");
console.log(code.substring(genStart, genEnd));


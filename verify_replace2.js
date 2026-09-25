const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');
console.log("Grid applied:", code.includes("gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))'"));
console.log("Wrapper applied:", code.includes("boxShadow: '0 10px 30px rgba(0,0,0,0.5)'"));
console.log("Empty state applied:", code.includes("<FileText size={48} style={{ opacity: 0.2 }} />"));

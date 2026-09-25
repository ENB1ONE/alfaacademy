const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');
let match = code.match(/\{modulo === 'presencas' && \([\s\S]*?<table[\s\S]*?<\/table>[\s\S]*?\)\}/);
if (match) {
    console.log(match[0].substring(0, 1500));
} else {
    console.log("No table logic found");
}

const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');
const match = code.match(/<select[^>]*value=\{modulo\}[^>]*>[\s\S]*?<\/div>/);
if (match) {
    let idx = match.index;
    console.log(code.substring(idx - 100, idx + 4000));
}

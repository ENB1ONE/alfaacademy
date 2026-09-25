const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');
let idx = code.indexOf('useLocation');
if(idx > -1) {
    console.log(code.substring(idx - 100, idx + 500));
} else {
    console.log("useLocation not found");
}

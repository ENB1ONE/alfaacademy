const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');
console.log("Start block:", code.includes('{/* HIDDEN EXECUTIVE DASHBOARD REPORT */}'));
console.log("End block:", code.includes('</div></div><div className="responsive-grid-2">'));

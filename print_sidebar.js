const fs = require('fs');
let code = fs.readFileSync('crm/src/components/Layout.jsx', 'utf8');
let start = code.indexOf('<nav className="sidebar-nav">');
let end = code.indexOf('</nav>', start);
console.log(code.substring(start, end + 6));

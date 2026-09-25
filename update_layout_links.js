const fs = require('fs');
let code = fs.readFileSync('crm/src/components/Layout.jsx', 'utf8');

// Change Link and NavLink "to" props to prefix with /app
code = code.replace(/to="\/(?!app)([^"]+)"/g, 'to="/app/$1"');
// Fix index route which was `to="/"` -> now `to="/app"`
code = code.replace(/to="\/"/g, 'to="/app"');

fs.writeFileSync('crm/src/components/Layout.jsx', code, 'utf8');
console.log("Layout links updated.");

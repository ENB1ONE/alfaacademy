const fs = require('fs');

// 1. Revert App.jsx
let appCode = fs.readFileSync('crm/src/App.jsx', 'utf8');
appCode = appCode.replace("import PublicPortal from './pages/PublicPortal';\n", "");
appCode = appCode.replace(/<Route path="\/" element={<PublicPortal \/>} \/>\s*<Route path="\/app"/, '<Route path="/"');
fs.writeFileSync('crm/src/App.jsx', appCode, 'utf8');

// 2. Revert Login.jsx
let loginCode = fs.readFileSync('crm/src/pages/Login.jsx', 'utf8');
loginCode = loginCode.replace("navigate('/app');", "navigate('/');");
fs.writeFileSync('crm/src/pages/Login.jsx', loginCode, 'utf8');

// 3. Revert Layout.jsx links
let layoutCode = fs.readFileSync('crm/src/components/Layout.jsx', 'utf8');
layoutCode = layoutCode.replace(/to="\/app\//g, 'to="/');
layoutCode = layoutCode.replace(/to="\/app"/g, 'to="/"');
// Also fix bottom nav active states
layoutCode = layoutCode.replace(/location\.pathname === '\/app'/g, "location.pathname === '/'");
fs.writeFileSync('crm/src/components/Layout.jsx', layoutCode, 'utf8');

// 4. Revert Overview.jsx links
let overviewCode = fs.readFileSync('crm/src/pages/Overview.jsx', 'utf8');
overviewCode = overviewCode.replace(/link="\/app\//g, 'link="/');
fs.writeFileSync('crm/src/pages/Overview.jsx', overviewCode, 'utf8');

console.log("Public Portal removed and routes reverted to /.");

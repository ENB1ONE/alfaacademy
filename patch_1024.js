const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');

// 1. Expand Dashboard A4 Preview to 1024px
code = code.replace(/<div id="dashboard-a4-preview" style=\{\{\s*width: '800px',\s*minWidth: '800px',\s*maxWidth: '800px'/g, 
    `<div id="dashboard-a4-preview" style={{ width: '1024px', minWidth: '1024px', maxWidth: '1024px'`);

// 2. Expand BI Generator A4 Preview to 1024px
code = code.replace(/<div id="a4-preview" style=\{\{\s*width: '800px',\s*minWidth: '800px',\s*maxWidth: '800px'/g, 
    `<div id="a4-preview" style={{ width: '1024px', minWidth: '1024px', maxWidth: '1024px'`);

// 3. Expand the hidden wrapper of the dashboard to 1024px
code = code.replace(/<div style=\{\{\s*position: 'fixed',\s*top: 0,\s*left: 0,\s*width: '800px',\s*zIndex: -9999,\s*opacity: 0\.001,\s*pointerEvents: 'none'\s*\}\}>/g,
    `<div style={{ position: 'fixed', top: 0, left: 0, width: '1024px', zIndex: -9999, opacity: 0.001, pointerEvents: 'none' }}>`);

// 4. Ensure windowWidth is 1200 to cover the 1024px element safely
// (It's likely already 1200 from the previous patch, but let's make sure it's at least 1200)
code = code.replace(/windowWidth: \d+/g, 'windowWidth: 1200');

fs.writeFileSync('crm/src/pages/CentralRelatorios.jsx', code, 'utf8');
console.log('Expanded base A4 widths to 1024px to prevent internal layout overflow.');

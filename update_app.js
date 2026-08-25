const fs = require('fs');
let code = fs.readFileSync('crm/src/App.jsx', 'utf8');

code = code.replace(/import GeradorRelatorios from '\.\/pages\/GeradorRelatorios';/, `import CentralRelatorios from './pages/CentralRelatorios';`);
code = code.replace(/<GeradorRelatorios \/>/, `<CentralRelatorios />`);

fs.writeFileSync('crm/src/App.jsx', code, 'utf8');
console.log('App.jsx updated');

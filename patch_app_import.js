const fs = require('fs');
let code = fs.readFileSync('crm/src/App.jsx', 'utf8');

if (!code.includes('import InstallPrompt')) {
  code = `import InstallPrompt from './components/InstallPrompt';\n` + code;
  fs.writeFileSync('crm/src/App.jsx', code, 'utf8');
  console.log('App.jsx patched with InstallPrompt import');
}

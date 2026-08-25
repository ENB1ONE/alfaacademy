const fs = require('fs');
let code = fs.readFileSync('crm/src/App.jsx', 'utf8');

if (!code.includes('InstallPrompt')) {
  code = code.replace(
    /import ErrorBoundary from '\.\/components\/ErrorBoundary';/,
    `import ErrorBoundary from './components/ErrorBoundary';\nimport InstallPrompt from './components/InstallPrompt';`
  );

  code = code.replace(
    /<ErrorBoundary>/,
    `<ErrorBoundary>\n      <InstallPrompt />`
  );

  fs.writeFileSync('crm/src/App.jsx', code, 'utf8');
  console.log('App.jsx updated with InstallPrompt');
} else {
  console.log('Already updated');
}

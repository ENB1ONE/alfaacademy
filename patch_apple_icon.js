const fs = require('fs');
let code = fs.readFileSync('crm/index.html', 'utf8');

if (!code.includes('apple-touch-icon')) {
    code = code.replace(
      /<link rel="manifest" href="\/alfaacademy\/admin\/manifest.json" \/>/,
      `<link rel="manifest" href="/alfaacademy/admin/manifest.json" />\n    <link rel="apple-touch-icon" href="/alfaacademy/admin/logo192.png" />`
    );
    fs.writeFileSync('crm/index.html', code, 'utf8');
}
console.log('index.html updated for apple-touch-icon');

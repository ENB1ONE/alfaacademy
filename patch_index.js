const fs = require('fs');
let code = fs.readFileSync('crm/index.html', 'utf8');

if (!code.includes('manifest.json')) {
    code = code.replace(
      /<head>/,
      `<head>\n    <link rel="manifest" href="/alfaacademy/admin/manifest.json" />`
    );
    fs.writeFileSync('crm/index.html', code, 'utf8');
}
console.log('index.html updated');

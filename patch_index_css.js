const fs = require('fs');

let code = fs.readFileSync('index.html', 'utf8');

code = code.replace(/background:var\(--preto\) background:rgba/g, 'background:var(--preto); background:rgba');

fs.writeFileSync('index.html', code, 'utf8');
console.log('Fixed CSS syntax errors in index.html');

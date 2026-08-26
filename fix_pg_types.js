const fs = require('fs');
let code = fs.readFileSync('admin.js', 'utf8');

// Replace all $${count++} with type casts just to be sure!
code = code.replace(/AND c.nome = \$\$\{count\+\+\}/g, 'AND c.nome = $${count++}::text');
code = code.replace(/AND a.id = \$\$\{count\+\+\}/g, 'AND a.id = $${count++}::integer');
code = code.replace(/AND a.status_medico = \$\$\{count\+\+\}/g, 'AND a.status_medico = $${count++}::text');

fs.writeFileSync('admin.js', code, 'utf8');
console.log('Explicit casts added.');

const fs = require('fs');
let code = fs.readFileSync('admin_remote.js', 'utf8');

code = code.replace(
    /SELECT \s*a\.id, a\.nome, a\.categoria_id, c\.nome as categoria_nome/g,
    "SELECT a.id, a.nome, a.foto, a.categoria_id, c.nome as categoria_nome"
);

fs.writeFileSync('admin_remote.js', code, 'utf8');

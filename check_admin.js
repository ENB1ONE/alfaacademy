const fs = require('fs');
let code = fs.readFileSync('admin.js', 'utf8');

// Update GET /atletas to only return active athletes
code = code.replace(/SELECT a\.\*, c\.nome as categoria_nome FROM atletas a LEFT JOIN categorias c ON a\.categoria_id = c\.id ORDER BY a\.nome/g, 
"SELECT a.*, c.nome as categoria_nome FROM atletas a LEFT JOIN categorias c ON a.categoria_id = c.id WHERE a.ativo = true ORDER BY a.nome");

// Wait, let's just make sure it's correct. Let's do a more generic replace.
// Actually, let me just look at the code first.
console.log(code.substring(code.indexOf("router.get('/atletas'"), code.indexOf("router.get('/atletas'") + 300));

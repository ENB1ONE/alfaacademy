const fs = require('fs');

let code = fs.readFileSync('admin_remote.js', 'utf8');

// GET
code = code.replace(
    "SELECT t.id, t.nome, t.usuario_lc, t.perfil,",
    "SELECT t.id, t.nome, t.usuario_lc, t.perfil, t.foto,"
);

// POST
code = code.replace(
    "const { nome, usuario_lc, senha, perfil, categorias } = req.body;",
    "const { nome, usuario_lc, senha, perfil, categorias, foto } = req.body;"
);
code = code.replace(
    "\"INSERT INTO treinadores (nome, usuario_lc, senha_hash, perfil, precisa_trocar_senha) VALUES ($1, $2, $3, $4, true) RETURNING id\"",
    "\"INSERT INTO treinadores (nome, usuario_lc, senha_hash, perfil, foto, precisa_trocar_senha) VALUES ($1, $2, $3, $4, $5, true) RETURNING id\""
);
code = code.replace(
    "const resT = await client.query(q1, [nome, usuario_lc.toLowerCase(), senhaHash, perfil]);",
    "const resT = await client.query(q1, [nome, usuario_lc.toLowerCase(), senhaHash, perfil, foto || '']);"
);

// PUT (First we replace the req.body destructuring)
// Note: It appears again in PUT
let parts = code.split("const { nome, usuario_lc, senha, perfil, categorias } = req.body;");
if (parts.length === 3) { // 1 before POST, 1 before PUT
    code = parts[0] + "const { nome, usuario_lc, senha, perfil, categorias, foto } = req.body;" + parts[1] + "const { nome, usuario_lc, senha, perfil, categorias, foto } = req.body;" + parts[2];
}

// PUT SQL 1 (with password)
code = code.replace(
    "await client.query(\"UPDATE treinadores SET nome = $1, usuario_lc = $2, senha_hash = $3, perfil = $4 WHERE id = $5\", [nome, usuario_lc.toLowerCase(), senhaHash, perfil, id]);",
    "await client.query(\"UPDATE treinadores SET nome = $1, usuario_lc = $2, senha_hash = $3, perfil = $4, foto = $5 WHERE id = $6\", [nome, usuario_lc.toLowerCase(), senhaHash, perfil, foto || '', id]);"
);

// PUT SQL 2 (without password)
code = code.replace(
    "await client.query(\"UPDATE treinadores SET nome = $1, usuario_lc = $2, perfil = $3 WHERE id = $4\", [nome, usuario_lc.toLowerCase(), perfil, id]);",
    "await client.query(\"UPDATE treinadores SET nome = $1, usuario_lc = $2, perfil = $3, foto = $4 WHERE id = $5\", [nome, usuario_lc.toLowerCase(), perfil, foto || '', id]);"
);

fs.writeFileSync('admin_remote.js', code, 'utf8');
console.log('admin_remote.js patched.');

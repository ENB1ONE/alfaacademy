const fs = require('fs');
let code = fs.readFileSync('admin_remote.js', 'utf8');

code = code.replace(
    /const \{ nome, categoria_id, posicao, nome_responsavel, telefone_responsavel, status_medico \} = req\.body;/g,
    "const { nome, categoria_id, posicao, nome_responsavel, telefone_responsavel, status_medico, foto } = req.body;"
);

code = code.replace(
    /INSERT INTO atletas \(nome, categoria_id, posicao, nome_responsavel, telefone_responsavel, status_medico\)/,
    "INSERT INTO atletas (nome, categoria_id, posicao, nome_responsavel, telefone_responsavel, status_medico, foto)"
);

code = code.replace(
    /VALUES \(\$1, \$2, \$3, \$4, \$5, \$6\) RETURNING \*/,
    "VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *"
);

code = code.replace(
    /const r = await pool\.query\(query, \[nome, catId, posicao, nome_responsavel, telefone_responsavel, status_medico\]\);/,
    "const r = await pool.query(query, [nome, catId, posicao, nome_responsavel, telefone_responsavel, status_medico, foto]);"
);

code = code.replace(
    /SET nome = \$1, categoria_id = \$2, posicao = \$3, nome_responsavel = \$4, telefone_responsavel = \$5, status_medico = \$6\s*WHERE id = \$7 RETURNING \*/,
    "SET nome = $1, categoria_id = $2, posicao = $3, nome_responsavel = $4, telefone_responsavel = $5, status_medico = $6, foto = COALESCE($7, foto) WHERE id = $8 RETURNING *"
);

code = code.replace(
    /const r = await pool\.query\(query, \[nome, catId, posicao, nome_responsavel, telefone_responsavel, status_medico, id\]\);/,
    "const r = await pool.query(query, [nome, catId, posicao, nome_responsavel, telefone_responsavel, status_medico, foto, id]);"
);

fs.writeFileSync('admin_remote.js', code, 'utf8');

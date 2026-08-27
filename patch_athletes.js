const fs = require('fs');
let code = fs.readFileSync('/opt/alfa-api/routes/admin.js', 'utf8');

// Patch POST /atletas
const postRegex = /const \{ nome, categoria_id, posicao, nome_responsavel, telefone_responsavel, status_medico, foto \} = req\.body;\s*const catId = categoria_id === '' \? null : categoria_id;\s*try \{\s*const query = `\s*INSERT INTO atletas \(nome, categoria_id, posicao, nome_responsavel, telefone_responsavel, status_medico, foto\)\s*VALUES \(\$1, \$2, \$3, \$4, \$5, \$6, \$7\) RETURNING \*\s*`;\s*const r = await pool\.query\(query, \[nome, catId, posicao, nome_responsavel, telefone_responsavel, status_medico, foto\]\);/;

const newPost = `const { nome, categoria_id, posicao, posicao_secundaria, pe_dominante, peso, altura, competicoes, clube_atual, nome_responsavel, telefone_responsavel, status_medico, foto } = req.body;
    const catId = categoria_id === '' ? null : categoria_id;
    try {
        const query = \`
            INSERT INTO atletas (nome, categoria_id, posicao, posicao_secundaria, pe_dominante, peso, altura, competicoes, clube_atual, nome_responsavel, telefone_responsavel, status_medico, foto) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *
        \`;
        const r = await pool.query(query, [nome, catId, posicao, posicao_secundaria, pe_dominante, peso || null, altura || null, competicoes, clube_atual, nome_responsavel, telefone_responsavel, status_medico, foto]);`;

code = code.replace(postRegex, newPost);

// Patch PUT /atletas/:id
const putRegex = /const \{ nome, categoria_id, posicao, nome_responsavel, telefone_responsavel, status_medico, foto \} = req\.body;\s*const catId = categoria_id === '' \? null : categoria_id;\s*try \{\s*const query = `\s*UPDATE atletas\s*SET nome = \$1, categoria_id = \$2, posicao = \$3, nome_responsavel = \$4, telefone_responsavel = \$5, status_medico = \$6, foto = COALESCE\(\$7, foto\) WHERE id = \$8 RETURNING \*\s*`;\s*const r = await pool\.query\(query, \[nome, catId, posicao, nome_responsavel, telefone_responsavel, status_medico, foto, id\]\);/;

const newPut = `const { nome, categoria_id, posicao, posicao_secundaria, pe_dominante, peso, altura, competicoes, clube_atual, nome_responsavel, telefone_responsavel, status_medico, foto } = req.body;
    const catId = categoria_id === '' ? null : categoria_id;
    try {
        const query = \`
            UPDATE atletas 
            SET nome = $1, categoria_id = $2, posicao = $3, posicao_secundaria = $4, pe_dominante = $5, peso = $6, altura = $7, competicoes = $8, clube_atual = $9, nome_responsavel = $10, telefone_responsavel = $11, status_medico = $12, foto = COALESCE($13, foto) WHERE id = $14 RETURNING *
        \`;
        const r = await pool.query(query, [nome, catId, posicao, posicao_secundaria, pe_dominante, peso || null, altura || null, competicoes, clube_atual, nome_responsavel, telefone_responsavel, status_medico, foto, id]);`;

code = code.replace(putRegex, newPut);

fs.writeFileSync('/opt/alfa-api/routes/admin.js', code, 'utf8');
console.log('Backend athletes endpoints patched successfully.');

const fs = require('fs');
let code = fs.readFileSync('admin_api.js', 'utf8');

// Replace POST /atletas
const oldPost = `router.post('/atletas', verificarAcesso, async (req, res) => {
    const { nome, categoria_id, posicao, nome_responsavel, telefone_responsavel, status_medico, foto } = req.body;
    const catId = categoria_id === '' ? null : categoria_id;
    try {
        const query = \`
            INSERT INTO atletas (nome, categoria_id, posicao, nome_responsavel, telefone_responsavel, status_medico, foto) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *
        \`;
        const r = await pool.query(query, [nome, catId, posicao, nome_responsavel, telefone_responsavel, status_medico, foto]);
        registrarLog(req.usuario.id, \`Cadastrou atleta \${nome}\`, { atleta_id: r.rows[0].id });
        res.json({ success: true, atleta: r.rows[0] });
    } catch (error) { console.error(error); res.status(500).json({ error: 'Erro interno' }); }
});`;

const newPost = `router.post('/atletas', verificarAcesso, async (req, res) => {
    const { nome, categoria_id, posicao, nome_responsavel, telefone_responsavel, status_medico, foto, peso, altura, pe_dominante, competicoes, clube_atual } = req.body;
    const catId = categoria_id === '' ? null : categoria_id;
    try {
        const query = \`
            INSERT INTO atletas (nome, categoria_id, posicao, nome_responsavel, telefone_responsavel, status_medico, foto, peso, altura, pe_dominante, competicoes, clube_atual) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *
        \`;
        const r = await pool.query(query, [nome, catId, posicao, nome_responsavel, telefone_responsavel, status_medico, foto, peso || null, altura || null, pe_dominante, competicoes, clube_atual]);
        registrarLog(req.usuario.id, \`Cadastrou atleta \${nome}\`, { atleta_id: r.rows[0].id });
        res.json({ success: true, atleta: r.rows[0] });
    } catch (error) { console.error(error); res.status(500).json({ error: 'Erro interno' }); }
});`;

// Replace PUT /atletas/:id
const oldPut = `router.put('/atletas/:id', verificarAcesso, async (req, res) => {
    const { id } = req.params;
    const { nome, categoria_id, posicao, nome_responsavel, telefone_responsavel, status_medico, foto } = req.body;
    const catId = categoria_id === '' ? null : categoria_id;
    try {
        const query = \`
            UPDATE atletas 
            SET nome = $1, categoria_id = $2, posicao = $3, nome_responsavel = $4, telefone_responsavel = $5, status_medico = $6, foto = COALESCE($7, foto) WHERE id = $8 RETURNING *
        \`;
        const r = await pool.query(query, [nome, catId, posicao, nome_responsavel, telefone_responsavel, status_medico, foto, id]);
        registrarLog(req.usuario.id, \`Editou atleta \${nome}\`, { atleta_id: id });
        res.json({ success: true, atleta: r.rows[0] });
    } catch (error) { console.error(error); res.status(500).json({ error: 'Erro interno' }); }
});`;

const newPut = `router.put('/atletas/:id', verificarAcesso, async (req, res) => {
    const { id } = req.params;
    const { nome, categoria_id, posicao, nome_responsavel, telefone_responsavel, status_medico, foto, peso, altura, pe_dominante, competicoes, clube_atual } = req.body;
    const catId = categoria_id === '' ? null : categoria_id;
    try {
        const query = \`
            UPDATE atletas 
            SET nome = $1, categoria_id = $2, posicao = $3, nome_responsavel = $4, telefone_responsavel = $5, status_medico = $6, foto = COALESCE($7, foto), peso = $8, altura = $9, pe_dominante = $10, competicoes = $11, clube_atual = $12
            WHERE id = $13 RETURNING *
        \`;
        const r = await pool.query(query, [nome, catId, posicao, nome_responsavel, telefone_responsavel, status_medico, foto, peso || null, altura || null, pe_dominante, competicoes, clube_atual, id]);
        registrarLog(req.usuario.id, \`Editou atleta \${nome}\`, { atleta_id: id });
        res.json({ success: true, atleta: r.rows[0] });
    } catch (error) { console.error(error); res.status(500).json({ error: 'Erro interno' }); }
});`;

code = code.replace(oldPost, newPost);
code = code.replace(oldPut, newPut);

fs.writeFileSync('admin_api_patched.js', code);
console.log('Routes patched!');

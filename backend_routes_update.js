// Copie estas rotas e cole no seu arquivo principal da API (ex: server.js ou app.js)
// Lembre-se de verificar se as variáveis 'router' e 'pool' estão corretas de acordo com o seu código.

// 1. Edição de Atleta (PUT)
router.put('/atletas/:id', verificarAdmin, async (req, res) => {
    const { id } = req.params;
    const { nome, categoria, posicao, nome_responsavel, telefone_responsavel, status_medico } = req.body;
    try {
        const query = `
            UPDATE atletas 
            SET nome = $1, categoria = $2, posicao = $3, nome_responsavel = $4, telefone_responsavel = $5, status_medico = $6
            WHERE id = $7 RETURNING *
        `;
        const result = await pool.query(query, [nome, categoria, posicao, nome_responsavel, telefone_responsavel, status_medico, id]);
        res.json({ success: true, atleta: result.rows[0] });
    } catch (error) {
        console.error('Erro ao atualizar atleta:', error);
        res.status(500).json({ success: false, erro: 'Erro interno no servidor.' });
    }
});

// 2. Exclusão de Atleta (DELETE)
router.delete('/atletas/:id', verificarAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query("DELETE FROM atletas WHERE id = $1", [id]);
        res.json({ success: true, message: 'Atleta excluído com sucesso.' });
    } catch (error) {
        console.error('Erro ao excluir atleta:', error);
        res.status(500).json({ success: false, erro: 'Erro interno no servidor.' });
    }
});

// 3. Edição de Treinador (PUT)
router.put('/treinadores/:id', verificarAdmin, async (req, res) => {
    const { id } = req.params;
    const { nome, usuario_lc, senha, perfil } = req.body;
    try {
        if (senha && senha.trim() !== '') {
            const senhaHash = require('bcryptjs').hashSync(senha, 10);
            await pool.query(
                "UPDATE treinadores SET nome = $1, usuario_lc = $2, senha_hash = $3, perfil = $4 WHERE id = $5", 
                [nome, usuario_lc.toLowerCase(), senhaHash, perfil, id]
            );
        } else {
            await pool.query(
                "UPDATE treinadores SET nome = $1, usuario_lc = $2, perfil = $3 WHERE id = $4", 
                [nome, usuario_lc.toLowerCase(), perfil, id]
            );
        }
        res.json({ success: true, message: 'Treinador atualizado.' });
    } catch (error) {
        console.error('Erro ao atualizar treinador:', error);
        res.status(500).json({ success: false, erro: 'Erro interno.' });
    }
});

// 4. Exclusão de Treinador (DELETE)
router.delete('/treinadores/:id', verificarAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query("DELETE FROM treinadores WHERE id = $1", [id]);
        res.json({ success: true, message: 'Treinador excluído.' });
    } catch (error) {
        console.error('Erro ao excluir treinador:', error);
        res.status(500).json({ success: false, erro: 'Erro interno.' });
    }
});

// 5. Salvar Lista de Chamada (POST)
router.post('/chamadas', verificarAdmin, async (req, res) => {
    const { categoria, presencas } = req.body; // presencas: [{atleta_id: 1, presente: true}, ...]
    try {
        const data_chamada = new Date().toISOString().split('T')[0]; // Hoje (YYYY-MM-DD)
        
        for (let p of presencas) {
            // Verifica se já existe chamada para este atleta hoje
            const check = await pool.query("SELECT id FROM frequencia WHERE atleta_id = $1 AND data = $2", [p.atleta_id, data_chamada]);
            if (check.rows.length > 0) {
                // Atualiza
                await pool.query("UPDATE frequencia SET status = $1 WHERE id = $2", [p.presente ? 'Presente' : 'Falta', check.rows[0].id]);
            } else {
                // Insere
                await pool.query("INSERT INTO frequencia (atleta_id, data, status) VALUES ($1, $2, $3)", [p.atleta_id, data_chamada, p.presente ? 'Presente' : 'Falta']);
            }
        }
        res.json({ success: true, message: 'Chamada salva com sucesso.' });
    } catch (error) {
        console.error('Erro ao salvar chamada:', error);
        res.status(500).json({ success: false, erro: 'Erro interno ao salvar chamada.' });
    }
});

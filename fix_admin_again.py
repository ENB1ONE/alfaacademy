with open("admin_fixed.js", "r", encoding="utf-8") as f:
    text = f.read()

# Find the start of router.post('/chamadas' and cut everything after it
idx = text.find("router.post('/chamadas'")
if idx != -1:
    text = text[:idx]

# Append the correct code
new_code = """router.post('/chamadas', verificarAdmin, async (req, res) => {
    const { categoria, presencas } = req.body;
    const data_chamada = new Date().toISOString().split('T')[0];

    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        let treinoId;
        const resTreino = await client.query("SELECT id FROM treinos WHERE categoria = $1 AND data = $2", [categoria, data_chamada]);
        if (resTreino.rows.length > 0) {
            treinoId = resTreino.rows[0].id;
        } else {
            const insertTreino = await client.query("INSERT INTO treinos (categoria, data, titulo) VALUES ($1, $2, $3) RETURNING id", [categoria, data_chamada, 'Treino Regular']);
            treinoId = insertTreino.rows[0].id;
        }
        
        for (let p of presencas) {
            const status = p.presente ? 'P' : 'F';
            const checkP = await client.query("SELECT * FROM presencas WHERE treino_id = $1 AND atleta_id = $2", [treinoId, p.atleta_id]);
            if (checkP.rows.length > 0) {
                await client.query("UPDATE presencas SET status = $1 WHERE treino_id = $2 AND atleta_id = $3", [status, treinoId, p.atleta_id]);
            } else {
                await client.query("INSERT INTO presencas (treino_id, atleta_id, status) VALUES ($1, $2, $3)", [treinoId, p.atleta_id, status]);
            }
        }
        
        await client.query('COMMIT');
        res.json({ success: true, message: 'Chamada salva com sucesso.' });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Erro ao salvar chamada:', error);
        res.status(500).json({ success: false, erro: 'Erro interno ao salvar chamada.' });
    } finally {
        client.release();
    }
});

module.exports = router;
"""

text = text + new_code

with open("admin_fixed.js", "w", encoding="utf-8") as f:
    f.write(text)

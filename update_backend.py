with open("admin_backend.js", "r", encoding="utf-8") as f:
    text = f.read()

# Replace POST /chamadas
old_chamadas = """router.post('/chamadas', verificarAcesso, async (req, res) => {
    const { categoria_id, presencas } = req.body;
    const data_chamada = new Date().toISOString().split('T')[0];

    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        let treinoId;
        const resTreino = await client.query("SELECT id FROM treinos WHERE categoria_id = $1 AND data = $2", [categoria_id, data_chamada]);
        if (resTreino.rows.length > 0) {
            treinoId = resTreino.rows[0].id;
        } else {
            const insertTreino = await client.query("INSERT INTO treinos (categoria_id, data, titulo) VALUES ($1, $2, $3) RETURNING id", [categoria_id, data_chamada, 'Treino Regular']);
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
        
        await client.query('COMMIT');"""

new_chamadas = """router.post('/chamadas', verificarAcesso, async (req, res) => {
    const { categoria_id, presencas, titulo, tipo } = req.body;
    const data_chamada = new Date().toISOString().split('T')[0];
    const eventTitle = titulo || 'Treino Regular';
    const eventType = tipo || 'TREINO';

    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        let treinoId;
        // Check for exact same event to prevent duplicates on double-submit
        const resTreino = await client.query("SELECT id FROM treinos WHERE categoria_id = $1 AND data = $2 AND titulo = $3", [categoria_id, data_chamada, eventTitle]);
        if (resTreino.rows.length > 0) {
            treinoId = resTreino.rows[0].id;
            // Optionally update tipo if changed, though rare
            await client.query("UPDATE treinos SET tipo = $1 WHERE id = $2", [eventType, treinoId]);
        } else {
            const insertTreino = await client.query("INSERT INTO treinos (categoria_id, data, titulo, tipo) VALUES ($1, $2, $3, $4) RETURNING id", [categoria_id, data_chamada, eventTitle, eventType]);
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
        
        await client.query('COMMIT');"""

text = text.replace(old_chamadas, new_chamadas)

# Add POST /eventos right before module.exports
new_eventos = """
// ==========================================
// AGENDAMENTO DE EVENTOS (JOGOS / EVENTOS FUTUROS)
// ==========================================
router.post('/eventos', verificarAcesso, async (req, res) => {
    const { categoria_id, data, titulo, tipo } = req.body;
    try {
        const eventTitle = titulo || 'Jogo Oficial';
        const eventType = tipo || 'JOGO';
        
        const check = await pool.query("SELECT id FROM treinos WHERE categoria_id = $1 AND data = $2 AND titulo = $3", [categoria_id, data, eventTitle]);
        if (check.rows.length > 0) {
            return res.json({ success: true, message: 'Evento já existente.' });
        }
        
        await pool.query("INSERT INTO treinos (categoria_id, data, titulo, tipo) VALUES ($1, $2, $3, $4)", [categoria_id, data, eventTitle, eventType]);
        registrarLog(req.usuario.id, `Agendou evento ${eventTitle} para Categoria ID ${categoria_id}`, null);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = router;"""

text = text.replace("module.exports = router;", new_eventos)

# Fix GET /historico-chamadas to also return "tipo" so the frontend can style games differently!
old_historico_chamadas = """SELECT 
                t.id, t.data, t.titulo,"""
new_historico_chamadas = """SELECT 
                t.id, t.data, t.titulo, t.tipo,"""

text = text.replace(old_historico_chamadas, new_historico_chamadas)

# Fix GET /treinos to also return "tipo"
old_treinos = """SELECT 
                t.id, t.data, t.titulo,"""
new_treinos = """SELECT 
                t.id, t.data, t.titulo, t.tipo,"""

text = text.replace(old_treinos, new_treinos)

with open("admin_backend.js", "w", encoding="utf-8") as f:
    f.write(text)

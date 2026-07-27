with open("admin_backend.js", "r", encoding="utf-8") as f:
    text = f.read()

new_route = """
// ==========================================
// RELATÓRIO DE FREQUÊNCIA GERAL
// ==========================================
router.get('/frequencia-geral', verificarAcesso, async (req, res) => {
    try {
        let q = `
            SELECT 
                a.id, a.nome, c.nome as categoria_nome,
                COUNT(p.atleta_id) as total_eventos,
                SUM(CASE WHEN p.status = 'P' THEN 1 ELSE 0 END) as total_presencas,
                SUM(CASE WHEN p.status = 'F' THEN 1 ELSE 0 END) as total_faltas
            FROM atletas a
            LEFT JOIN categorias c ON a.categoria_id = c.id
            LEFT JOIN presencas p ON a.id = p.atleta_id
            GROUP BY a.id, a.nome, c.nome
            ORDER BY total_faltas DESC;
        `;
        let vals = [];
        
        if (req.usuario.perfil === 'Treinador') {
            q = `
                SELECT 
                    a.id, a.nome, c.nome as categoria_nome,
                    COUNT(p.atleta_id) as total_eventos,
                    SUM(CASE WHEN p.status = 'P' THEN 1 ELSE 0 END) as total_presencas,
                    SUM(CASE WHEN p.status = 'F' THEN 1 ELSE 0 END) as total_faltas
                FROM atletas a
                LEFT JOIN categorias c ON a.categoria_id = c.id
                LEFT JOIN presencas p ON a.id = p.atleta_id
                JOIN treinador_categoria tc ON a.categoria_id = tc.categoria_id
                WHERE tc.treinador_id = $1
                GROUP BY a.id, a.nome, c.nome
                ORDER BY total_faltas DESC;
            `;
            vals.push(req.usuario.id);
        }
        
        const r = await pool.query(q, vals);
        res.json(r.rows);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = router;"""

text = text.replace("module.exports = router;", new_route)

with open("admin_backend.js", "w", encoding="utf-8") as f:
    f.write(text)

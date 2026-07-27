with open("admin_backend.js", "r", encoding="utf-8") as f:
    text = f.read()

# Edit /metricas to include top_faltosos
old_metricas = """const team = await pool.query("SELECT COUNT(*) FROM treinadores");
        
        res.json({ 
            success: true, 
            total_atletas: tot.rows[0].count,
            departamento_medico: dm.rows[0].count,
            equipe_tecnica: team.rows[0].count
        });"""

new_metricas = """const team = await pool.query("SELECT COUNT(*) FROM treinadores");
        
        let faltasQ = "SELECT a.nome, COUNT(p.id) as faltas FROM presencas p JOIN atletas a ON p.atleta_id = a.id WHERE p.status = 'F' GROUP BY a.id ORDER BY faltas DESC LIMIT 5";
        if (req.usuario.perfil === 'Treinador') {
            faltasQ = "SELECT a.nome, COUNT(p.id) as faltas FROM presencas p JOIN atletas a ON p.atleta_id = a.id JOIN treinador_categoria tc ON a.categoria_id = tc.categoria_id WHERE tc.treinador_id = $1 AND p.status = 'F' GROUP BY a.id ORDER BY faltas DESC LIMIT 5";
        }
        const topFaltosos = await pool.query(faltasQ, vals);
        
        res.json({ 
            success: true, 
            total_atletas: tot.rows[0].count,
            departamento_medico: dm.rows[0].count,
            equipe_tecnica: team.rows[0].count,
            top_faltosos: topFaltosos.rows
        });"""

text = text.replace(old_metricas, new_metricas)

# Add /eventos/proximos
new_route = """// ==========================================
// PRÓXIMOS JOGOS
// ==========================================
router.get('/eventos/proximos', verificarAcesso, async (req, res) => {
    try {
        let q = "SELECT t.id, TO_CHAR(t.data, 'DD/MM/YYYY') as data_br, t.titulo, c.nome as categoria_nome FROM treinos t LEFT JOIN categorias c ON t.categoria_id = c.id WHERE t.tipo = 'JOGO' AND t.data >= CURRENT_DATE AND t.data <= CURRENT_DATE + INTERVAL '10 days' ORDER BY t.data ASC";
        let vals = [];
        
        if (req.usuario.perfil === 'Treinador') {
            q = "SELECT t.id, TO_CHAR(t.data, 'DD/MM/YYYY') as data_br, t.titulo, c.nome as categoria_nome FROM treinos t LEFT JOIN categorias c ON t.categoria_id = c.id JOIN treinador_categoria tc ON t.categoria_id = tc.categoria_id WHERE tc.treinador_id = $1 AND t.tipo = 'JOGO' AND t.data >= CURRENT_DATE AND t.data <= CURRENT_DATE + INTERVAL '10 days' ORDER BY t.data ASC";
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

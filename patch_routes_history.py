with open("/opt/alfa-api/routes/admin.js", "r", encoding="utf-8") as f:
    text = f.read()

new_routes = """
// ==========================================
// HISTÓRICO DE CHAMADAS E RELATÓRIOS
// ==========================================

router.get('/historico-chamadas', verificarAcesso, async (req, res) => {
    try {
        let query = `
            SELECT a.id, a.nome, c.nome as categoria_nome,
                   COUNT(p.id) as total_treinos,
                   SUM(CASE WHEN p.status = 'P' THEN 1 ELSE 0 END) as presencas,
                   SUM(CASE WHEN p.status = 'F' THEN 1 ELSE 0 END) as faltas
            FROM atletas a
            LEFT JOIN categorias c ON a.categoria_id = c.id
            LEFT JOIN presencas p ON a.id = p.atleta_id
            WHERE a.categoria_id IS NOT NULL
        `;
        let values = [];

        if (req.usuario.perfil === 'Treinador') {
            query += ` AND a.categoria_id IN (SELECT categoria_id FROM treinador_categoria WHERE treinador_id = $1) `;
            values.push(req.usuario.id);
        }

        query += ` GROUP BY a.id, a.nome, c.nome ORDER BY presencas DESC, a.nome ASC `;

        const r = await pool.query(query, values);
        
        // Calculate percentages
        const ranking = r.rows.map(row => {
            const total = parseInt(row.total_treinos) || 0;
            const pres = parseInt(row.presencas) || 0;
            const perc = total > 0 ? Math.round((pres / total) * 100) : 0;
            return { ...row, total_treinos: total, presencas: pres, faltas: parseInt(row.faltas) || 0, frequencia: perc };
        });

        res.json({ success: true, ranking });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno' });
    }
});

router.get('/treinos', verificarAcesso, async (req, res) => {
    try {
        let query = `
            SELECT t.id, t.data, t.titulo, c.nome as categoria_nome,
                   COUNT(p.id) as total_atletas,
                   SUM(CASE WHEN p.status = 'P' THEN 1 ELSE 0 END) as presentes,
                   SUM(CASE WHEN p.status = 'F' THEN 1 ELSE 0 END) as ausentes
            FROM treinos t
            JOIN categorias c ON t.categoria_id = c.id
            LEFT JOIN presencas p ON t.id = p.treino_id
        `;
        let values = [];

        if (req.usuario.perfil === 'Treinador') {
            query += ` WHERE t.categoria_id IN (SELECT categoria_id FROM treinador_categoria WHERE treinador_id = $1) `;
            values.push(req.usuario.id);
        }

        query += ` GROUP BY t.id, t.data, t.titulo, c.nome ORDER BY t.data DESC `;

        const r = await pool.query(query, values);
        res.json({ success: true, treinos: r.rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno' });
    }
});

router.get('/treinos/:id/presencas', verificarAcesso, async (req, res) => {
    try {
        const { id } = req.params;
        // Validação de acesso do treinador
        if (req.usuario.perfil === 'Treinador') {
            const check = await pool.query(`
                SELECT 1 FROM treinos t 
                JOIN treinador_categoria tc ON t.categoria_id = tc.categoria_id 
                WHERE t.id = $1 AND tc.treinador_id = $2
            `, [id, req.usuario.id]);
            if (check.rows.length === 0) return res.status(403).json({ error: 'Acesso Negado' });
        }

        const r = await pool.query(`
            SELECT p.status, a.nome as atleta_nome
            FROM presencas p
            JOIN atletas a ON p.atleta_id = a.id
            WHERE p.treino_id = $1
            ORDER BY a.nome ASC
        `, [id]);

        res.json({ success: true, presencas: r.rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno' });
    }
});

module.exports = router;
"""

if "/historico-chamadas" not in text:
    text = text.replace("module.exports = router;", new_routes)
    with open("/opt/alfa-api/routes/admin.js", "w", encoding="utf-8") as f:
        f.write(text)


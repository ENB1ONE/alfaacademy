const fs = require('fs');
let code = fs.readFileSync('admin_downloaded.js', 'utf8');

const newRoute = `
router.get('/atletas/:id/historico', verificarAcesso, async (req, res) => {
    try {
        const query = "SELECT t.data AS data_treino, p.status, a.nome, c.nome as categoria FROM presencas p JOIN atletas a ON p.atleta_id = a.id LEFT JOIN categorias c ON a.categoria_id = c.id JOIN treinos t ON p.treino_id = t.id WHERE a.id = $1 ORDER BY t.data DESC";
        const { rows } = await pool.query(query, [req.params.id]);
        res.json({ success: true, dados: rows });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Erro ao carregar historico' });
    }
});

module.exports = router;
`;

code = code.replace('module.exports = router;', newRoute);
fs.writeFileSync('admin_downloaded.js', code, 'utf8');
console.log("Endpoint added to local file.");

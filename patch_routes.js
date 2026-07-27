const fs = require('fs');
const path = require('path');
const p = path.join('/opt/alfa-api/routes/admin.js');
let content = fs.readFileSync(p, 'utf8');

if (!content.includes('/avisos')) {
    const avisosCode = 
// Avisos Endpoints
router.get('/avisos', verificarAdmin, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM avisos ORDER BY data_criacao DESC LIMIT 10');
        res.json({ success: true, avisos: result.rows });
    } catch(err) {
        console.error(err);
        res.status(500).json({ erro: 'Erro ao buscar avisos' });
    }
});

router.post('/avisos', verificarAdmin, async (req, res) => {
    try {
        const { titulo, descricao, tipo } = req.body;
        if(!titulo || !descricao) return res.status(400).json({ erro: 'Titulo e descricao obrigatorios' });
        await pool.query('INSERT INTO avisos (titulo, descricao, tipo) VALUES (\, \, \)', [titulo, descricao, tipo || 'Aviso']);
        res.json({ success: true });
    } catch(err) {
        console.error(err);
        res.status(500).json({ erro: 'Erro ao criar aviso' });
    }
});

router.delete('/avisos/:id', verificarAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM avisos WHERE id = \', [id]);
        res.json({ success: true });
    } catch(err) {
        console.error(err);
        res.status(500).json({ erro: 'Erro ao excluir aviso' });
    }
});
;
    // Insert before module.exports
    content = content.replace('module.exports = router;', avisosCode + '\nmodule.exports = router;');
    fs.writeFileSync(p, content);
    console.log('Rotas de avisos adicionadas!');
} else {
    console.log('Rotas ja existem.');
}

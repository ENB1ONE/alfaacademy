const fs = require('fs');
let code = fs.readFileSync('admin.js', 'utf8');

const newRoute = `
// ----------------------------------------------------
// GERADOR DINÂMICO DE RELATÓRIOS (BI)
// ----------------------------------------------------
router.post('/relatorios/gerador', verificarAdmin, async (req, res) => {
    const { modulo, filtros } = req.body;
    
    try {
        let query = '';
        const params = [];
        let count = 1;

        if (modulo === 'elenco') {
            query = 'SELECT nome, categoria, posicao, status_medico, status_pagamento FROM atletas WHERE 1=1';
            if (filtros && filtros.categoria) { query += \` AND categoria = $\${count++}\`; params.push(filtros.categoria); }
            if (filtros && filtros.status_medico) { query += \` AND status_medico = $\${count++}\`; params.push(filtros.status_medico); }
            query += ' ORDER BY nome ASC';
        } 
        else if (modulo === 'presencas') {
            query = \`SELECT p.data_treino, p.status, a.nome, a.categoria 
                     FROM presencas_treinos p 
                     JOIN atletas a ON p.atleta_id = a.id WHERE 1=1\`;
            if (filtros && filtros.categoria) { query += \` AND a.categoria = $\${count++}\`; params.push(filtros.categoria); }
            if (filtros && filtros.atleta_id) { query += \` AND a.id = $\${count++}\`; params.push(filtros.atleta_id); }
            query += ' ORDER BY p.data_treino DESC LIMIT 200';
        }
        else if (modulo === 'jogos') {
            query = 'SELECT data_jogo, adversario, categoria, resultado FROM jogos WHERE 1=1';
            if (filtros && filtros.categoria) { query += \` AND categoria = $\${count++}\`; params.push(filtros.categoria); }
            query += ' ORDER BY data_jogo DESC LIMIT 200';
        } else {
            return res.status(400).json({ success: false, message: 'Módulo inválido.' });
        }

        const result = await pool.query(query, params);
        res.json({ success: true, dados: result.rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Erro ao processar relatório dinâmico.' });
    }
});
`;

if (!code.includes('/relatorios/gerador')) {
    code = code.replace(/module\.exports\s*=\s*router;/, newRoute + '\nmodule.exports = router;');
    fs.writeFileSync('admin.js', code, 'utf8');
    console.log('admin.js patched');
} else {
    console.log('Route already exists');
}

// ROTAS CRM - RELATORIOS
router.get('/relatorios/hoje', verificarAdmin, async (req, res) => {
    try {
        const dataHoje = new Date().toISOString().split('T')[0];
        
        // Atletas no DM (Justificado hoje)
        const queryDM = 
            SELECT a.nome, a.categoria, p.status 
            FROM presencas p
            JOIN atletas a ON p.atleta_id = a.id
            JOIN treinos t ON p.treino_id = t.id
            WHERE t.data = $1 
              AND p.status = 'J'
        ;
        const dmResult = await pool.query(queryDM, [dataHoje]);

        // Frequencia total
        const queryFreq = 
            SELECT 
                COUNT(*) FILTER (WHERE p.status = 'P') as presentes,
                COUNT(*) FILTER (WHERE p.status = 'F') as ausentes,
                COUNT(*) FILTER (WHERE p.status = 'J') as justificados
            FROM presencas p
            JOIN treinos t ON p.treino_id = t.id
            WHERE t.data = $1
        ;
        const freqResult = await pool.query(queryFreq, [dataHoje]);

        res.json({
            success: true,
            departamento_medico: dmResult.rows,
            frequencia_hoje: freqResult.rows[0]
        });

    } catch (error) {
        console.error('Erro ao buscar relatorios CRM:', error);
        res.status(500).json({ erro: 'Erro interno no servidor.' });
    }
});

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const pool = new Pool({
    user: 'alfa_user',
    host: 'localhost',
    database: 'alfa_db',
    password: 'alfa123',
    port: 5432,
});

const SECRET_KEY = 'alfa_academy_secreto_seguro';

const verificarToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Token ausente' });
    
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.usuario = decoded; 
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Sessão inválida ou expirada.' });
    }
};

router.get('/atletas/:categoria', verificarToken, async (req, res) => {
    try {
        const { categoria } = req.params;
        const query = 'SELECT id, nome, posicao FROM atletas WHERE categoria = $1 ORDER BY nome ASC';
        const result = await pool.query(query, [categoria]);
        res.json({ success: true, atletas: result.rows });
    } catch (error) {
        console.error("Erro ao buscar atletas:", error);
        res.status(500).json({ success: false, message: 'Erro no servidor' });
    }
});

router.post('/salvar', verificarToken, async (req, res) => {
    const { chamada } = req.body; 
    if (!chamada || chamada.length === 0) return res.json({ success: true, message: 'Nenhum dado para salvar' });

    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        // Obter a categoria a partir do primeiro atleta
        const catRes = await client.query('SELECT categoria FROM atletas WHERE id = $1', [chamada[0].atleta_id]);
        if (catRes.rowCount === 0) throw new Error('Atleta não encontrado');
        const categoria = catRes.rows[0].categoria;

        // Criar ou obter o treino de hoje para esta categoria
        const dataHoje = new Date().toISOString().split('T')[0];
        let treinoId;
        const treinoRes = await client.query('SELECT id FROM treinos WHERE categoria = $1 AND data = $2', [categoria, dataHoje]);
        
        if (treinoRes.rowCount > 0) {
            treinoId = treinoRes.rows[0].id;
        } else {
            const novoTreino = await client.query(
                "INSERT INTO treinos (categoria, data, titulo) VALUES ($1, $2, 'Treino') RETURNING id",
                [categoria, dataHoje]
            );
            treinoId = novoTreino.rows[0].id;
        }
        
        const upsertQuery = `
            INSERT INTO presencas (treino_id, atleta_id, status)
            VALUES ($1, $2, $3)
            ON CONFLICT (treino_id, atleta_id) 
            DO UPDATE SET status = EXCLUDED.status, marcado_em = now();
        `;

        for (let item of chamada) {
            let s = 'F';
            if (item.status === 'presente') s = 'P';
            else if (item.status === 'justificado') s = 'J';
            
            await client.query(upsertQuery, [treinoId, item.atleta_id, s]);
        }

        await client.query('COMMIT');
        res.json({ success: true, message: 'Chamada registrada com sucesso!' });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error("Erro ao salvar chamada:", error);
        res.status(500).json({ success: false, message: 'Falha ao salvar chamada no banco.' });
    } finally {
        client.release();
    }
});

module.exports = router;

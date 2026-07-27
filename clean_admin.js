
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

const pool = new Pool({
    user: 'alfa_user',
    host: 'localhost',
    database: 'alfa_db',
    password: 'alfa123',
    port: 5432,
});

const SECRET_KEY = 'alfa_academy_secreto_seguro';

const verificarAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Token ausente' });
    
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        if (decoded.perfil !== 'Administrador' && decoded.perfil !== 'admin') {
            return res.status(403).json({ error: 'Acesso negado.' });
        }
        req.usuario = decoded; 
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Sessão inválida ou expirada.' });
    }
};

router.post('/treinadores', verificarAdmin, async (req, res) => {
    const { nome, usuario_lc, senha, perfil } = req.body;
    if (!nome || !usuario_lc || !senha) return res.status(400).json({ success: false, message: 'Preencha todos os dados.' });

    try {
        const senhaHash = bcrypt.hashSync(senha, 10);
        const perfilDefinido = perfil || 'Treinador';
        const query = "INSERT INTO treinadores (nome, usuario, usuario_lc, senha_hash, perfil, precisa_trocar_senha) VALUES ($1, $2, $3, $4, $5, true) RETURNING id, nome, usuario, perfil";
        const result = await pool.query(query, [nome, usuario_lc, usuario_lc.toLowerCase(), senhaHash, perfilDefinido]);
        res.status(201).json({ success: true, message: 'Treinador cadastrado!', treinador: result.rows[0] });
    } catch (error) {
        console.error("Erro ao cadastrar treinador:", error);
        res.status(500).json({ success: false, message: 'Erro ao cadastrar treinador.' });
    }
});

router.get('/treinadores', verificarAdmin, async (req, res) => {
    try {
        const result = await pool.query("SELECT id, nome, usuario_lc as usuario, perfil FROM treinadores ORDER BY nome ASC");
        res.json({ success: true, treinadores: result.rows });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro ao listar treinadores.' });
    }
});

router.delete('/treinadores/:id', verificarAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query("DELETE FROM treinadores WHERE id = $1", [id]);
        res.json({ success: true, message: 'Usuário excluído com sucesso!' });
    } catch (error) {
        console.error("Erro ao excluir treinador:", error);
        res.status(500).json({ success: false, message: 'Erro ao excluir treinador.' });
    }
});

router.post('/treinadores/:id/reset-senha', verificarAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        const senhaPadraoHash = bcrypt.hashSync('alfa@123', 10);
        await pool.query("UPDATE treinadores SET senha_hash = $1, precisa_trocar_senha = true WHERE id = $2", [senhaPadraoHash, id]);
        res.json({ success: true, message: 'Senha resetada para alfa@123.' });
    } catch (error) {
        console.error("Erro ao resetar senha:", error);
        res.status(500).json({ success: false, message: 'Erro ao resetar senha.' });
    }
});

router.post('/atletas', verificarAdmin, async (req, res) => {
    const { nome, categoria, posicao, nome_responsavel, telefone_responsavel, status_medico } = req.body;
    if (!nome || !categoria) return res.status(400).json({ success: false, message: 'Nome e categoria são obrigatórios.' });

    try {
        const query = "INSERT INTO atletas (nome, categoria, posicao, nome_responsavel, telefone_responsavel, status_medico) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, nome, categoria";
        const result = await pool.query(query, [nome, categoria, posicao || 'Não definida', nome_responsavel || null, telefone_responsavel || null, status_medico || 'Apto']);
        res.status(201).json({ success: true, message: 'Atleta cadastrado!', atleta: result.rows[0] });
    } catch (error) {
        console.error("Erro ao cadastrar atleta:", error);
        res.status(500).json({ success: false, message: 'Erro ao cadastrar atleta.' });
    }
});

router.get('/atletas', verificarAdmin, async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM atletas ORDER BY nome ASC");
        res.json({ success: true, atletas: result.rows });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro ao listar atletas.' });
    }
});

router.put('/atletas/:id/status', verificarAdmin, async (req, res) => {
    const { id } = req.params;
    const { status_medico } = req.body;
    try {
        await pool.query("UPDATE atletas SET status_medico = $1 WHERE id = $2", [status_medico, id]);
        res.json({ success: true, message: 'Status médico atualizado!' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro ao atualizar status.' });
    }
});

router.get('/metricas', verificarAdmin, async (req, res) => {
    try {
        const atletasTotal = await pool.query("SELECT COUNT(*) FROM atletas");
        const atletasDM = await pool.query("SELECT COUNT(*) FROM atletas WHERE status_medico = 'Lesionado'");
        const treinadoresTotal = await pool.query("SELECT COUNT(*) FROM treinadores");

        res.json({
            success: true,
            metricas: {
                total_atletas: parseInt(atletasTotal.rows[0].count),
                total_dm: parseInt(atletasDM.rows[0].count),
                total_treinadores: parseInt(treinadoresTotal.rows[0].count)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro ao carregar metricas.' });
    }
});

router.get('/relatorios/hoje', verificarAdmin, async (req, res) => {
    try {
        const dataHoje = new Date().toISOString().split('T')[0];
        
        const queryDM = "SELECT a.nome, a.categoria, p.status FROM presencas p JOIN atletas a ON p.atleta_id = a.id JOIN treinos t ON p.treino_id = t.id WHERE t.data = $1 AND p.status = 'J'";
        const dmResult = await pool.query(queryDM, [dataHoje]);

        const queryFreq = "SELECT COUNT(*) FILTER (WHERE p.status = 'P') as presentes, COUNT(*) FILTER (WHERE p.status = 'F') as ausentes, COUNT(*) FILTER (WHERE p.status = 'J') as justificados FROM presencas p JOIN treinos t ON p.treino_id = t.id WHERE t.data = $1";
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

module.exports = router;

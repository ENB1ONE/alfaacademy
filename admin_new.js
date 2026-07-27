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

const verificarAcesso = (req, res, next) => {
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

const verificarAdmin = (req, res, next) => {
    verificarAcesso(req, res, () => {
        if (req.usuario.perfil !== 'Administrador' && req.usuario.perfil !== 'admin') {
            return res.status(403).json({ error: 'Acesso negado.' });
        }
        next();
    });
};

// Funçao auxiliar de Logs
const registrarLog = async (usuario_id, acao, detalhes) => {
    try {
        await pool.query("INSERT INTO activity_logs (usuario_id, acao, detalhes) VALUES ($1, $2, $3)", 
        [usuario_id, acao, JSON.stringify(detalhes)]);
    } catch(e) { console.error('Erro ao registrar log', e); }
};

// ==========================================
// CATEGORIAS
// ==========================================
router.get('/categorias', verificarAcesso, async (req, res) => {
    try {
        let query = "SELECT * FROM categorias ORDER BY nome";
        
        // Se for treinador, filtra pelas categorias dele
        if (req.usuario.perfil === 'Treinador') {
            query = `
                SELECT c.* FROM categorias c
                JOIN treinador_categoria tc ON tc.categoria_id = c.id
                WHERE tc.treinador_id = ${req.usuario.id}
                ORDER BY c.nome
            `;
        }
        const result = await pool.query(query);
        res.json({ success: true, categorias: result.rows });
    } catch (err) { console.error(err); res.status(500).json({ error: err.message }); }
});

router.post('/categorias', verificarAdmin, async (req, res) => {
    try {
        const { nome } = req.body;
        const r = await pool.query("INSERT INTO categorias (nome) VALUES ($1) RETURNING *", [nome]);
        registrarLog(req.usuario.id, `Criou categoria ${nome}`, { id: r.rows[0].id });
        res.json({ success: true, categoria: r.rows[0] });
    } catch (err) { console.error(err); res.status(500).json({ error: err.message }); }
});

router.delete('/categorias/:id', verificarAdmin, async (req, res) => {
    try {
        await pool.query("DELETE FROM categorias WHERE id = $1", [req.params.id]);
        registrarLog(req.usuario.id, `Excluiu categoria ID ${req.params.id}`, null);
        res.json({ success: true });
    } catch (err) { console.error(err); res.status(500).json({ error: err.message }); }
});

// ==========================================
// ATLETAS
// ==========================================
router.get('/atletas', verificarAcesso, async (req, res) => {
    try {
        let query = `
            SELECT a.*, c.nome as categoria 
            FROM atletas a 
            JOIN categorias c ON a.categoria_id = c.id 
        `;
        let values = [];

        if (req.usuario.perfil === 'Treinador') {
            query += `
                JOIN treinador_categoria tc ON tc.categoria_id = a.categoria_id
                WHERE tc.treinador_id = $1
            `;
            values.push(req.usuario.id);
        }
        
        query += " ORDER BY a.nome";
        const result = await pool.query(query, values);
        res.json({ success: true, atletas: result.rows });
    } catch (error) { console.error(error); res.status(500).json({ error: 'Erro interno' }); }
});

router.post('/atletas', verificarAcesso, async (req, res) => {
    const { nome, categoria_id, posicao, nome_responsavel, telefone_responsavel, status_medico } = req.body;
    const catId = categoria_id === '' ? null : categoria_id;
    try {
        const query = `
            INSERT INTO atletas (nome, categoria_id, posicao, nome_responsavel, telefone_responsavel, status_medico) 
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
        `;
        const r = await pool.query(query, [nome, catId, posicao, nome_responsavel, telefone_responsavel, status_medico]);
        registrarLog(req.usuario.id, `Cadastrou atleta ${nome}`, { atleta_id: r.rows[0].id });
        res.json({ success: true, atleta: r.rows[0] });
    } catch (error) { console.error(error); res.status(500).json({ error: 'Erro interno' }); }
});

router.put('/atletas/:id', verificarAcesso, async (req, res) => {
    const { id } = req.params;
    const { nome, categoria_id, posicao, nome_responsavel, telefone_responsavel, status_medico } = req.body;
    const catId = categoria_id === '' ? null : categoria_id;
    try {
        const query = `
            UPDATE atletas 
            SET nome = $1, categoria_id = $2, posicao = $3, nome_responsavel = $4, telefone_responsavel = $5, status_medico = $6
            WHERE id = $7 RETURNING *
        `;
        const r = await pool.query(query, [nome, catId, posicao, nome_responsavel, telefone_responsavel, status_medico, id]);
        registrarLog(req.usuario.id, `Editou atleta ${nome}`, { atleta_id: id });
        res.json({ success: true, atleta: r.rows[0] });
    } catch (error) { console.error(error); res.status(500).json({ error: 'Erro interno' }); }
});

router.delete('/atletas/:id', verificarAdmin, async (req, res) => {
    try {
        await pool.query("DELETE FROM atletas WHERE id = $1", [req.params.id]);
        registrarLog(req.usuario.id, `Excluiu atleta ID ${req.params.id}`, null);
        res.json({ success: true });
    } catch (error) { console.error(error); res.status(500).json({ error: 'Erro interno' }); }
});

router.put('/atletas/:id/status', verificarAcesso, async (req, res) => {
    const { id } = req.params;
    const { status_medico } = req.body;
    try {
        await pool.query("UPDATE atletas SET status_medico = $1 WHERE id = $2", [status_medico, id]);
        registrarLog(req.usuario.id, `Alterou status medico do atleta ID ${id} para ${status_medico}`, null);
        res.json({ success: true });
    } catch (error) { console.error(error); res.status(500).json({ error: 'Erro interno' }); }
});

// ==========================================
// TREINADORES (STAFF)
// ==========================================
router.get('/treinadores', verificarAdmin, async (req, res) => {
    try {
        const query = `
            SELECT t.id, t.nome, t.usuario_lc, t.perfil,
                   COALESCE(json_agg(c.*) FILTER (WHERE c.id IS NOT NULL), '[]') as categorias
            FROM treinadores t
            LEFT JOIN treinador_categoria tc ON t.id = tc.treinador_id
            LEFT JOIN categorias c ON tc.categoria_id = c.id
            GROUP BY t.id ORDER BY t.nome;
        `;
        const result = await pool.query(query);
        res.json({ success: true, treinadores: result.rows });
    } catch (error) { console.error(error); res.status(500).json({ error: 'Erro interno' }); }
});

router.post('/treinadores', verificarAdmin, async (req, res) => {
    const { nome, usuario_lc, senha, perfil, categorias } = req.body;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const senhaHash = bcrypt.hashSync(senha, 10);
        
        const q1 = "INSERT INTO treinadores (nome, usuario_lc, senha_hash, perfil, precisa_trocar_senha) VALUES ($1, $2, $3, $4, true) RETURNING id";
        const resT = await client.query(q1, [nome, usuario_lc.toLowerCase(), senhaHash, perfil]);
        const treinadorId = resT.rows[0].id;
        
        if (categorias && categorias.length > 0) {
            for (let catId of categorias) {
                await client.query("INSERT INTO treinador_categoria (treinador_id, categoria_id) VALUES ($1, $2)", [treinadorId, catId]);
            }
        }
        
        await client.query('COMMIT');
        registrarLog(req.usuario.id, `Cadastrou treinador ${nome}`, { treinador_id: treinadorId });
        res.status(201).json({ success: true, message: 'Treinador cadastrado!' });
    } catch (error) { console.error(error); await client.query('ROLLBACK'); res.status(500).json({ error: 'Erro interno' }); } finally { client.release(); }
});

router.put('/treinadores/:id', verificarAdmin, async (req, res) => {
    const { id } = req.params;
    const { nome, usuario_lc, senha, perfil, categorias } = req.body;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        if (senha && senha.trim() !== '') {
            const senhaHash = bcrypt.hashSync(senha, 10);
            await client.query("UPDATE treinadores SET nome = $1, usuario_lc = $2, senha_hash = $3, perfil = $4 WHERE id = $5", [nome, usuario_lc.toLowerCase(), senhaHash, perfil, id]);
        } else {
            await client.query("UPDATE treinadores SET nome = $1, usuario_lc = $2, perfil = $3 WHERE id = $4", [nome, usuario_lc.toLowerCase(), perfil, id]);
        }
        
        await client.query("DELETE FROM treinador_categoria WHERE treinador_id = $1", [id]);
        if (categorias && categorias.length > 0) {
            for (let catId of categorias) {
                await client.query("INSERT INTO treinador_categoria (treinador_id, categoria_id) VALUES ($1, $2)", [id, catId]);
            }
        }
        
        await client.query('COMMIT');
        registrarLog(req.usuario.id, `Editou treinador ID ${id}`, null);
        res.json({ success: true });
    } catch (error) { console.error(error); await client.query('ROLLBACK'); res.status(500).json({ error: 'Erro interno' }); } finally { client.release(); }
});

router.delete('/treinadores/:id', verificarAdmin, async (req, res) => {
    try {
        await pool.query("DELETE FROM treinadores WHERE id = $1", [req.params.id]);
        registrarLog(req.usuario.id, `Excluiu treinador ID ${req.params.id}`, null);
        res.json({ success: true });
    } catch (error) { console.error(error); res.status(500).json({ error: 'Erro interno' }); }
});

// ==========================================
// CHAMADAS E DASHBOARD
// ==========================================
router.post('/chamadas', verificarAcesso, async (req, res) => {
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
        
        await client.query('COMMIT');
        registrarLog(req.usuario.id, `Salvou chamada Categoria ID ${categoria_id}`, null);
        res.json({ success: true });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Erro chamada', error);
        res.status(500).json({ error: 'Erro ao salvar chamada.' });
    } finally { client.release(); }
});

router.get('/metricas', verificarAcesso, async (req, res) => {
    try {
        let atletaQ = "SELECT COUNT(*) FROM atletas";
        let dmQ = "SELECT COUNT(*) FROM atletas WHERE status_medico = 'Lesionado' OR status_medico = 'Transição'";
        let vals = [];
        
        if (req.usuario.perfil === 'Treinador') {
            atletaQ = `SELECT COUNT(*) FROM atletas a JOIN treinador_categoria tc ON a.categoria_id = tc.categoria_id WHERE tc.treinador_id = $1`;
            dmQ = `SELECT COUNT(*) FROM atletas a JOIN treinador_categoria tc ON a.categoria_id = tc.categoria_id WHERE tc.treinador_id = $1 AND (status_medico = 'Lesionado' OR status_medico = 'Transição')`;
            vals.push(req.usuario.id);
        }
        
        const tot = await pool.query(atletaQ, vals);
        const dm = await pool.query(dmQ, vals);
        const team = await pool.query("SELECT COUNT(*) FROM treinadores");
        
        res.json({ 
            success: true, 
            total_atletas: tot.rows[0].count,
            departamento_medico: dm.rows[0].count,
            equipe_tecnica: team.rows[0].count
        });
    } catch (e) { res.status(500).json({error: e.message}); }
});

router.get('/relatorios', verificarAcesso, async (req, res) => {
    try {
        let q = `
            SELECT 
                c.nome as categoria,
                COUNT(DISTINCT t.id) as total_sessoes,
                COUNT(DISTINCT a.id) as atletas_ativos,
                COALESCE(AVG(CASE WHEN p.status = 'P' THEN 100 ELSE 0 END), 0) as presenca_media
            FROM categorias c
            LEFT JOIN atletas a ON a.categoria_id = c.id
            LEFT JOIN treinos t ON t.categoria_id = c.id
            LEFT JOIN presencas p ON p.treino_id = t.id AND p.atleta_id = a.id
        `;
        let vals = [];
        if (req.usuario.perfil === 'Treinador') {
            q += ` JOIN treinador_categoria tc ON tc.categoria_id = c.id WHERE tc.treinador_id = $1`;
            vals.push(req.usuario.id);
        }
        q += ` GROUP BY c.id ORDER BY c.nome;`;
        
        const result = await pool.query(q, vals);
        res.json({ success: true, estatisticas: result.rows });
    } catch (err) { console.error(err); res.status(500).json({ error: err.message }); }
});

module.exports = router;

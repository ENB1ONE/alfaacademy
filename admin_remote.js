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


// Auto-migrate new columns for games
pool.query(`
    DO $$
    BEGIN
        BEGIN
            ALTER TABLE treinos ADD COLUMN campeonato VARCHAR(255);
        EXCEPTION
            WHEN duplicate_column THEN RAISE NOTICE 'column campeonato already exists';
        END;
        BEGIN
            ALTER TABLE treinos ADD COLUMN horario VARCHAR(50);
        EXCEPTION
            WHEN duplicate_column THEN RAISE NOTICE 'column horario already exists';
        END;
        BEGIN
            ALTER TABLE treinos ADD COLUMN observacao TEXT;
        EXCEPTION
            WHEN duplicate_column THEN RAISE NOTICE 'column observacao already exists';
        END;
    END $$;
`).catch(console.error);


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
            LEFT JOIN categorias c ON a.categoria_id = c.id 
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
    const { nome, categoria_id, posicao, nome_responsavel, telefone_responsavel, status_medico, foto } = req.body;
    const catId = categoria_id === '' ? null : categoria_id;
    try {
        const query = `
            INSERT INTO atletas (nome, categoria_id, posicao, nome_responsavel, telefone_responsavel, status_medico, foto) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *
        `;
        const r = await pool.query(query, [nome, catId, posicao, nome_responsavel, telefone_responsavel, status_medico, foto]);
        registrarLog(req.usuario.id, `Cadastrou atleta ${nome}`, { atleta_id: r.rows[0].id });
        res.json({ success: true, atleta: r.rows[0] });
    } catch (error) { console.error(error); res.status(500).json({ error: 'Erro interno' }); }
});

router.put('/atletas/:id', verificarAcesso, async (req, res) => {
    const { id } = req.params;
    const { nome, categoria_id, posicao, nome_responsavel, telefone_responsavel, status_medico, foto } = req.body;
    const catId = categoria_id === '' ? null : categoria_id;
    try {
        const query = `
            UPDATE atletas 
            SET nome = $1, categoria_id = $2, posicao = $3, nome_responsavel = $4, telefone_responsavel = $5, status_medico = $6, foto = COALESCE($7, foto) WHERE id = $8 RETURNING *
        `;
        const r = await pool.query(query, [nome, catId, posicao, nome_responsavel, telefone_responsavel, status_medico, foto, id]);
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
            SELECT t.id, t.nome, t.usuario_lc, t.perfil, t.foto,
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
    const { nome, usuario_lc, senha, perfil, categorias, foto } = req.body;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const senhaHash = bcrypt.hashSync(senha, 10);
        
        const q1 = "INSERT INTO treinadores (nome, usuario_lc, senha_hash, perfil, foto, precisa_trocar_senha) VALUES ($1, $2, $3, $4, $5, true) RETURNING id";
        const resT = await client.query(q1, [nome, usuario_lc.toLowerCase(), senhaHash, perfil, foto || '']);
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
            await client.query("UPDATE treinadores SET nome = $1, usuario_lc = $2, senha_hash = $3, perfil = $4, foto = $5 WHERE id = $6", [nome, usuario_lc.toLowerCase(), senhaHash, perfil, foto || '', id]);
        } else {
            await client.query("UPDATE treinadores SET nome = $1, usuario_lc = $2, perfil = $3, foto = $4 WHERE id = $5", [nome, usuario_lc.toLowerCase(), perfil, foto || '', id]);
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
    const { categoria_id, presencas, titulo, tipo, campeonato, horario, observacao } = req.body;
    const data_chamada = new Date().toISOString().split('T')[0];
    const eventTitle = titulo || 'Treino Regular';
    const eventType = tipo || 'TREINO';

    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        let treinoId;
        // Check for exact same event to prevent duplicates on double-submit
        const resTreino = await client.query("SELECT id FROM treinos WHERE categoria_id = $1 AND data = $2 AND titulo = $3", [categoria_id, data_chamada, eventTitle]);
        if (resTreino.rows.length > 0) {
            treinoId = resTreino.rows[0].id;
            // Optionally update tipo if changed, though rare
            await client.query("UPDATE treinos SET tipo = $1 WHERE id = $2", [eventType, treinoId]);
        } else {
            const insertTreino = await client.query("INSERT INTO treinos (categoria_id, data, titulo, tipo, campeonato, horario, observacao) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id", [categoria_id, data_chamada, eventTitle, eventType, campeonato || '', horario || '', observacao || '']);
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
        
        let faltasQ = "SELECT a.nome, COUNT(*) as faltas FROM presencas p JOIN atletas a ON p.atleta_id = a.id WHERE p.status = 'F' GROUP BY a.id ORDER BY faltas DESC LIMIT 5";
        if (req.usuario.perfil === 'Treinador') {
            faltasQ = "SELECT a.nome, COUNT(*) as faltas FROM presencas p JOIN atletas a ON p.atleta_id = a.id JOIN treinador_categoria tc ON a.categoria_id = tc.categoria_id WHERE tc.treinador_id = $1 AND p.status = 'F' GROUP BY a.id ORDER BY faltas DESC LIMIT 5";
        }
        const topFaltosos = await pool.query(faltasQ, vals);
        
        res.json({ 
            success: true, 
            total_atletas: tot.rows[0].count,
            departamento_medico: dm.rows[0].count,
            equipe_tecnica: team.rows[0].count,
            top_faltosos: topFaltosos.rows
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


// ==========================================
// HISTÓRICO DE CHAMADAS E RELATÓRIOS
// ==========================================

router.get('/historico-chamadas', verificarAcesso, async (req, res) => {
    try {
        let query = `
            SELECT a.id, a.nome, c.nome as categoria_nome,
                   COUNT(*) as total_treinos,
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
                   COUNT(*) as total_atletas,
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
            SELECT p.status, a.nome as atleta_nome, a.foto
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


// ==========================================
// AGENDAMENTO DE EVENTOS (JOGOS / EVENTOS FUTUROS)
// ==========================================
router.post('/eventos', verificarAcesso, async (req, res) => {
    const { categorias_ids, data, titulo, tipo, campeonato, horario, observacao } = req.body;
    try {
        const eventTitle = titulo || 'Jogo Oficial';
        const eventType = tipo || 'JOGO';
        
        if (!categorias_ids || !Array.isArray(categorias_ids) || categorias_ids.length === 0) {
            return res.status(400).json({ error: 'Nenhuma categoria selecionada.' });
        }
        
        // Iterate through all selected categories and insert a game for each
        for (let cat_id of categorias_ids) {
            const check = await pool.query("SELECT id FROM treinos WHERE categoria_id = $1 AND data = $2 AND titulo = $3", [cat_id, data, eventTitle]);
            if (check.rows.length === 0) {
                await pool.query("INSERT INTO treinos (categoria_id, data, titulo, tipo, campeonato, horario, observacao) VALUES ($1, $2, $3, $4, $5, $6, $7)", [cat_id, data, eventTitle, eventType, campeonato || "", horario || "", observacao || ""]);
            }
        }
        
        registrarLog(req.usuario.id, `Agendou evento ${eventTitle} para Múltiplas Categorias`, null);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// ==========================================
// PRÓXIMOS JOGOS
// ==========================================
router.get('/eventos/proximos', verificarAcesso, async (req, res) => {
    try {
        let q = "SELECT t.id, TO_CHAR(t.data, 'DD/MM/YYYY') as data_br, t.titulo, t.campeonato, t.horario, t.observacao, c.nome as categoria_nome FROM treinos t LEFT JOIN categorias c ON t.categoria_id = c.id WHERE t.tipo = 'JOGO' AND t.data >= CURRENT_DATE AND t.data <= CURRENT_DATE + INTERVAL '10 days' ORDER BY t.data ASC";
        let vals = [];
        
        if (req.usuario.perfil === 'Treinador') {
            q = "SELECT t.id, TO_CHAR(t.data, 'DD/MM/YYYY') as data_br, t.titulo, t.campeonato, t.horario, t.observacao, c.nome as categoria_nome FROM treinos t LEFT JOIN categorias c ON t.categoria_id = c.id JOIN treinador_categoria tc ON t.categoria_id = tc.categoria_id WHERE tc.treinador_id = $1 AND t.tipo = 'JOGO' AND t.data >= CURRENT_DATE AND t.data <= CURRENT_DATE + INTERVAL '10 days' ORDER BY t.data ASC";
            vals.push(req.usuario.id);
        }
        
        const r = await pool.query(q, vals);
        res.json(r.rows);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});


// ==========================================
// RELATÓRIO DE FREQUÊNCIA GERAL
// ==========================================
router.get('/frequencia-geral', verificarAcesso, async (req, res) => {
    try {
        let q = `
            SELECT a.id, a.nome, a.foto, a.categoria_id, c.nome as categoria_nome,
                COUNT(p.atleta_id) as total_eventos,
                COALESCE(SUM(CASE WHEN p.status = 'P' THEN 1 ELSE 0 END), 0) as total_presencas,
                COALESCE(SUM(CASE WHEN p.status = 'F' THEN 1 ELSE 0 END), 0) as total_faltas,
                (SELECT COUNT(*) FROM convocacoes conv WHERE conv.atleta_id = a.id) as total_convocacoes
            FROM atletas a
            LEFT JOIN categorias c ON a.categoria_id = c.id
            LEFT JOIN presencas p ON a.id = p.atleta_id
            GROUP BY a.id, a.nome, a.categoria_id, c.nome
            ORDER BY total_faltas DESC;
        `;
        let vals = [];
        
        if (req.usuario.perfil === 'Treinador') {
            q = `
                SELECT a.id, a.nome, a.foto, a.categoria_id, c.nome as categoria_nome,
                    COUNT(p.atleta_id) as total_eventos,
                    COALESCE(SUM(CASE WHEN p.status = 'P' THEN 1 ELSE 0 END), 0) as total_presencas,
                    COALESCE(SUM(CASE WHEN p.status = 'F' THEN 1 ELSE 0 END), 0) as total_faltas,
                (SELECT COUNT(*) FROM convocacoes conv WHERE conv.atleta_id = a.id) as total_convocacoes
                FROM atletas a
                LEFT JOIN categorias c ON a.categoria_id = c.id
                LEFT JOIN presencas p ON a.id = p.atleta_id
                JOIN treinador_categoria tc ON a.categoria_id = tc.categoria_id
                WHERE tc.treinador_id = $1
                GROUP BY a.id, a.nome, a.categoria_id, c.nome
                ORDER BY total_faltas DESC;
            `;
            vals.push(req.usuario.id);
        }
        
        const r = await pool.query(q, vals);
        res.json(r.rows);
    } catch (e) {
        console.error("ERRO FREQUENCIA-GERAL:", e);
        res.status(500).json({ error: e.message });
    }
});





// SETUP DB (JOGOS)
router.get('/setup-db', async (req, res) => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS convocacoes (
                treino_id INT NOT NULL REFERENCES treinos(id) ON DELETE CASCADE,
                atleta_id INT NOT NULL REFERENCES atletas(id) ON DELETE CASCADE,
                PRIMARY KEY (treino_id, atleta_id)
            );
        `);
        res.send("OK");
    } catch (e) {
        res.status(500).send(e.toString());
    }
});


// ==========================================
// JOGOS E CONVOCACOES
// ==========================================
router.get('/jogos', verificarAcesso, async (req, res) => {
    try {
        // Group games by date and title so frontend displays a single row per game
        let q = `
            SELECT 
                TO_CHAR(t.data, 'YYYY-MM-DD') as data_raw, 
                TO_CHAR(t.data, 'DD/MM/YYYY') as data_br, 
                t.titulo as adversario,
                t.campeonato,
                t.horario,
                t.observacao,
                ARRAY_AGG(t.id) as treino_ids, 
                ARRAY_AGG(c.nome) as categorias_nomes,
                ARRAY_AGG(t.categoria_id) as categorias_ids
            FROM treinos t 
            LEFT JOIN categorias c ON t.categoria_id = c.id
        `;
        let vals = [];
        
        if (req.usuario.perfil === 'Treinador') {
            q += ` JOIN treinador_categoria tc ON t.categoria_id = tc.categoria_id WHERE tc.treinador_id = $1 AND t.tipo = 'JOGO' `;
            vals.push(req.usuario.id);
        } else {
            q += ` WHERE t.tipo = 'JOGO' `;
        }
        
        q += " GROUP BY t.data, t.titulo, t.campeonato, t.horario, t.observacao ORDER BY data_raw DESC ";
        
        const r = await pool.query(q, vals);
        // Map to format that is easy to consume (e.g. generate a pseudo-id for React keys)
        const formatted = r.rows.map((row, index) => ({
            id: 'jogo_' + index,
            data_raw: row.data_raw,
            data_br: row.data_br,
            adversario: row.adversario,
            campeonato: row.campeonato,
            horario: row.horario,
            observacao: row.observacao,
            treino_ids: row.treino_ids,
            categorias_nomes: row.categorias_nomes,
            categorias_ids: row.categorias_ids
        }));
        res.json(formatted);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.get('/jogos/:id/convocados', verificarAcesso, async (req, res) => {
    try {
        const { id } = req.params;
        const gameRes = await pool.query("SELECT categoria_id FROM treinos WHERE id = $1", [id]);
        if (gameRes.rows.length === 0) return res.status(404).json({error: 'Jogo não encontrado'});
        const catId = gameRes.rows[0].categoria_id;

        const r = await pool.query(`
            SELECT a.id, a.nome, a.posicao, 
                   CASE WHEN c.atleta_id IS NOT NULL THEN true ELSE false END as convocado
            FROM atletas a
            LEFT JOIN convocacoes c ON a.id = c.atleta_id AND c.treino_id = $1
            WHERE a.categoria_id = $2
            ORDER BY a.nome ASC
        `, [id, catId]);
        
        res.json(r.rows);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.post('/jogos/:id/convocacao', verificarAcesso, async (req, res) => {
    try {
        const { id } = req.params;
        const { atletas_ids } = req.body;
        
        await pool.query("BEGIN");
        await pool.query("DELETE FROM convocacoes WHERE treino_id = $1", [id]);
        
        if (atletas_ids && atletas_ids.length > 0) {
            for (let atleta_id of atletas_ids) {
                await pool.query("INSERT INTO convocacoes (treino_id, atleta_id) VALUES ($1, $2)", [id, atleta_id]);
            }
        }
        
        await pool.query("COMMIT");
        registrarLog(req.usuario.id, `Atualizou convocação do jogo ID ${id}`, { atletas: atletas_ids });
        res.json({ success: true });
    } catch (e) {
        await pool.query("ROLLBACK");
        res.status(500).json({ error: e.message });
    }
});




router.delete('/eventos/deletar', verificarAcesso, async (req, res) => {
    const { titulo, data } = req.body;
    try {
        await pool.query("BEGIN");
        // deleting from treinos will cascade to convocacoes
        await pool.query("DELETE FROM treinos WHERE titulo = $1 AND data = $2 AND tipo = 'JOGO'", [titulo, data]);
        await pool.query("COMMIT");
        registrarLog(req.usuario.id, `Excluiu o jogo ${titulo}`, null);
        res.json({ success: true });
    } catch (e) {
        await pool.query("ROLLBACK");
        res.status(500).json({ error: e.message });
    }
});

router.put('/eventos/editar', verificarAcesso, async (req, res) => {
    const { old_titulo, old_data, new_titulo, new_data, new_categorias_ids, campeonato, horario, observacao } = req.body;
    try {
        if (!new_categorias_ids || !Array.isArray(new_categorias_ids) || new_categorias_ids.length === 0) {
            return res.status(400).json({ error: 'Selecione ao menos uma categoria.' });
        }
        
        await pool.query("BEGIN");
        
        // Find existing treinos for this game
        const existing = await pool.query("SELECT id, categoria_id FROM treinos WHERE titulo = $1 AND data = $2 AND tipo = 'JOGO'", [old_titulo, old_data]);
        const existingCatIds = existing.rows.map(r => r.categoria_id.toString());
        
        // Update basic info for all existing ones we are keeping
        for (let row of existing.rows) {
            const catStr = row.categoria_id.toString();
            if (new_categorias_ids.includes(catStr)) {
                await pool.query("UPDATE treinos SET titulo = $1, data = $2, campeonato = $4, horario = $5, observacao = $6 WHERE id = $3", [new_titulo, new_data, row.id, campeonato || '', horario || '', observacao || '']);
            } else {
                await pool.query("DELETE FROM treinos WHERE id = $1", [row.id]); // deletes convocacoes cascade
            }
        }
        
        // Insert new ones
        for (let catStr of new_categorias_ids) {
            if (!existingCatIds.includes(catStr)) {
                await pool.query("INSERT INTO treinos (categoria_id, data, titulo, tipo, campeonato, horario, observacao) VALUES ($1, $2, $3, 'JOGO', $4, $5, $6)", [parseInt(catStr), new_data, new_titulo, campeonato || '', horario || '', observacao || '']);
            }
        }
        
        await pool.query("COMMIT");
        registrarLog(req.usuario.id, `Editou o jogo ${old_titulo}`, null);
        res.json({ success: true });
    } catch (e) {
        await pool.query("ROLLBACK");
        res.status(500).json({ error: e.message });
    }
});

router.post('/jogos/multi-convocados', verificarAcesso, async (req, res) => {
    try {
        const { treino_ids } = req.body;
        if (!treino_ids || treino_ids.length === 0) return res.json([]);
        
        const gameRes = await pool.query("SELECT id as treino_id, categoria_id FROM treinos WHERE id = ANY($1::int[])", [treino_ids]);
        if (gameRes.rows.length === 0) return res.status(404).json({error: 'Jogo não encontrado'});
        
        // Fetch athletes for all involved categories
        const catIds = gameRes.rows.map(r => r.categoria_id);
        
        const r = await pool.query(`
            SELECT a.id, a.nome, a.posicao, a.foto, c.nome as categoria_nome, a.categoria_id,
                   t.id as treino_id,
                   CASE WHEN conv.atleta_id IS NOT NULL THEN true ELSE false END as convocado
            FROM atletas a
            JOIN categorias c ON a.categoria_id = c.id
            JOIN treinos t ON t.categoria_id = a.categoria_id AND t.id = ANY($1::int[])
            LEFT JOIN convocacoes conv ON a.id = conv.atleta_id AND conv.treino_id = t.id
            WHERE a.categoria_id = ANY($2::int[])
            ORDER BY c.nome ASC, a.nome ASC
        `, [treino_ids, catIds]);
        
        res.json(r.rows);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.post('/jogos/toggle-convocacao', verificarAcesso, async (req, res) => {
    try {
        const { atleta_id, treino_id, state } = req.body;
        
        if (state) {
            await pool.query("INSERT INTO convocacoes (treino_id, atleta_id) VALUES ($1, $2) ON CONFLICT DO NOTHING", [treino_id, atleta_id]);
        } else {
            await pool.query("DELETE FROM convocacoes WHERE treino_id = $1 AND atleta_id = $2", [treino_id, atleta_id]);
        }
        
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = router;

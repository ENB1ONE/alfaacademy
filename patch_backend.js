const fs = require('fs');
let code = fs.readFileSync('admin.js', 'utf8');

// 1. Update GET /atletas
const oldGet = `        let query = \`
            SELECT a.*, c.nome as categoria 
            FROM atletas a 
            LEFT JOIN categorias c ON a.categoria_id = c.id 
        \`;
        let values = [];

        if (req.usuario.perfil === 'Treinador') {
            query += \`
                JOIN treinador_categoria tc ON tc.categoria_id = a.categoria_id
                WHERE tc.treinador_id = $1
            \`;
            values.push(req.usuario.id);
        }`;

const newGet = `        let query = \`
            SELECT a.*, c.nome as categoria 
            FROM atletas a 
            LEFT JOIN categorias c ON a.categoria_id = c.id 
            WHERE a.ativo = true
        \`;
        let values = [];

        if (req.usuario.perfil === 'Treinador') {
            query += \`
                AND a.categoria_id IN (SELECT categoria_id FROM treinador_categoria WHERE treinador_id = $1)
            \`;
            values.push(req.usuario.id);
        }`;

if(code.includes(oldGet)) {
    code = code.replace(oldGet, newGet);
    console.log("Patched GET /atletas");
} else {
    console.log("Could not find GET /atletas block");
}

// 2. Add GET /atletas/inativos BEFORE GET /atletas/:id
const inativosEndpoint = `
router.get('/atletas/inativos', verificarAcesso, async (req, res) => {
    try {
        let query = \`
            SELECT a.*, c.nome as categoria 
            FROM atletas a 
            LEFT JOIN categorias c ON a.categoria_id = c.id 
            WHERE a.ativo = false 
        \`;
        let values = [];

        if (req.usuario.perfil === 'Treinador') {
            query += \`
                AND a.categoria_id IN (SELECT categoria_id FROM treinador_categoria WHERE treinador_id = $1)
            \`;
            values.push(req.usuario.id);
        }
        
        query += " ORDER BY a.nome";
        const result = await pool.query(query, values);
        res.json({ success: true, atletas: result.rows });
    } catch (error) { console.error(error); res.status(500).json({ error: 'Erro interno' }); }
});
`;

if (!code.includes('/atletas/inativos')) {
    code = code.replace("router.get('/atletas/:id'", inativosEndpoint + "\nrouter.get('/atletas/:id'");
    console.log("Added GET /atletas/inativos");
}

// 3. Update DELETE /atletas/:id
const oldDelete = `await pool.query("DELETE FROM atletas WHERE id = $1", [req.params.id]);`;
const newDelete = `await pool.query("UPDATE atletas SET ativo = false WHERE id = $1", [req.params.id]);`;
if(code.includes(oldDelete)) {
    code = code.replace(oldDelete, newDelete);
    console.log("Patched DELETE /atletas/:id");
} else {
    console.log("Could not find DELETE block");
}

fs.writeFileSync('admin.js', code, 'utf8');

# Fix 1: App.jsx
with open("crm/src/App.jsx", "r", encoding="utf-8") as f:
    text = f.read()

# Make sure /categorias is there
if "<Route path=\"categorias\"" not in text:
    text = text.replace("<Route path=\"equipe\" element={<PrivateRoute allowedRoles={['Administrador', 'admin', 'Admin']}><Staff /></PrivateRoute>} />", 
                        "<Route path=\"equipe\" element={<PrivateRoute allowedRoles={['Administrador', 'admin', 'Admin']}><Staff /></PrivateRoute>} />\n            <Route path=\"categorias\" element={<PrivateRoute allowedRoles={['Administrador', 'admin', 'Admin']}><Categories /></PrivateRoute>} />")

    if "import Categories from './pages/Categories';" not in text:
        text = text.replace("import Staff from './pages/Staff';", "import Staff from './pages/Staff';\nimport Categories from './pages/Categories';")

with open("crm/src/App.jsx", "w", encoding="utf-8") as f:
    f.write(text)

# Fix 2: Backend Admin JS
with open("admin_new.js", "r", encoding="utf-8") as f:
    admin = f.read()

import re

# Fix the treinadores insert query (remove 'usuario' column since it doesn't exist)
admin = admin.replace("INSERT INTO treinadores (nome, usuario, usuario_lc, senha_hash, perfil, precisa_trocar_senha) VALUES ($1, $2, $3, $4, $5, true)", 
                      "INSERT INTO treinadores (nome, usuario_lc, senha_hash, perfil, precisa_trocar_senha) VALUES ($1, $2, $3, $4, true)")
admin = admin.replace("await client.query(q1, [nome, usuario_lc, usuario_lc.toLowerCase(), senhaHash, perfil])", 
                      "await client.query(q1, [nome, usuario_lc.toLowerCase(), senhaHash, perfil])")

# Add console.error to all catch blocks for better debugging
admin = re.sub(r'catch\s*\((.*?)\)\s*\{\s*res\.status\(500\)\.json\(\{ error: (.*?) \}\);\s*\}', r'catch (\1) { console.error(\1); res.status(500).json({ error: \2 }); }', admin)
admin = re.sub(r'catch\s*\((.*?)\)\s*\{\s*await client\.query\(\'ROLLBACK\'\);\s*res\.status\(500\)\.json\(\{ error: (.*?) \}\);\s*\}', r'catch (\1) { console.error(\1); await client.query(\'ROLLBACK\'); res.status(500).json({ error: \2 }); }', admin)

# Fix empty categoria_id for atletas (if "" make it null)
fix_atleta_insert = """const { nome, categoria_id, posicao, nome_responsavel, telefone_responsavel, status_medico } = req.body;
    const catId = categoria_id === '' ? null : categoria_id;
    try {
        const query = `
            INSERT INTO atletas (nome, categoria_id, posicao, nome_responsavel, telefone_responsavel, status_medico) 
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
        `;
        const r = await pool.query(query, [nome, catId, posicao, nome_responsavel, telefone_responsavel, status_medico]);"""
admin = re.sub(r'const \{ nome, categoria_id, posicao, nome_responsavel, telefone_responsavel, status_medico \} = req\.body;\s*try \{\s*const query = `.*?`;\s*const r = await pool\.query\(query, \[nome, categoria_id, posicao, nome_responsavel, telefone_responsavel, status_medico\]\);', fix_atleta_insert, admin, flags=re.DOTALL)

fix_atleta_update = """const { nome, categoria_id, posicao, nome_responsavel, telefone_responsavel, status_medico } = req.body;
    const catId = categoria_id === '' ? null : categoria_id;
    try {
        const query = `
            UPDATE atletas 
            SET nome = $1, categoria_id = $2, posicao = $3, nome_responsavel = $4, telefone_responsavel = $5, status_medico = $6
            WHERE id = $7 RETURNING *
        `;
        const r = await pool.query(query, [nome, catId, posicao, nome_responsavel, telefone_responsavel, status_medico, id]);"""
admin = re.sub(r'const \{ nome, categoria_id, posicao, nome_responsavel, telefone_responsavel, status_medico \} = req\.body;\s*try \{\s*const query = `.*?`;\s*const r = await pool\.query\(query, \[nome, categoria_id, posicao, nome_responsavel, telefone_responsavel, status_medico, id\]\);', fix_atleta_update, admin, flags=re.DOTALL)

with open("admin_new.js", "w", encoding="utf-8") as f:
    f.write(admin)

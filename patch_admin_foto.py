import re

with open("admin_remote.js", "r", encoding="utf-8") as f:
    code = f.read()

old_post = '''const { nome, categoria_id, posicao, nome_responsavel, telefone_responsavel, status_medico } = req.body;
    const catId = categoria_id === '' ? null : categoria_id;
    try {
        const query = \
            INSERT INTO atletas (nome, categoria_id, posicao, nome_responsavel, telefone_responsavel, status_medico) 
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
        \;
        const r = await pool.query(query, [nome, catId, posicao, nome_responsavel, telefone_responsavel, status_medico]);'''

new_post = '''const { nome, categoria_id, posicao, nome_responsavel, telefone_responsavel, status_medico, foto } = req.body;
    const catId = categoria_id === '' ? null : categoria_id;
    try {
        const query = \
            INSERT INTO atletas (nome, categoria_id, posicao, nome_responsavel, telefone_responsavel, status_medico, foto) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *
        \;
        const r = await pool.query(query, [nome, catId, posicao, nome_responsavel, telefone_responsavel, status_medico, foto]);'''

code = code.replace(old_post.strip(), new_post.strip())


old_put = '''const { nome, categoria_id, posicao, nome_responsavel, telefone_responsavel, status_medico } = req.body;
    const catId = categoria_id === '' ? null : categoria_id;
    try {
        const query = \
            UPDATE atletas 
            SET nome = $1, categoria_id = $2, posicao = $3, nome_responsavel = $4, telefone_responsavel = $5, status_medico = $6
            WHERE id = $7 RETURNING *
        \;
        const r = await pool.query(query, [nome, catId, posicao, nome_responsavel, telefone_responsavel, status_medico, id]);'''

new_put = '''const { nome, categoria_id, posicao, nome_responsavel, telefone_responsavel, status_medico, foto } = req.body;
    const catId = categoria_id === '' ? null : categoria_id;
    try {
        const query = \
            UPDATE atletas 
            SET nome = $1, categoria_id = $2, posicao = $3, nome_responsavel = $4, telefone_responsavel = $5, status_medico = $6, foto = COALESCE($7, foto)
            WHERE id = $8 RETURNING *
        \;
        const r = await pool.query(query, [nome, catId, posicao, nome_responsavel, telefone_responsavel, status_medico, foto, id]);'''

code = code.replace(old_put.strip(), new_put.strip())

old_multi = '''SELECT a.id, a.nome, a.posicao, c.nome as categoria_nome, a.categoria_id,'''
new_multi = '''SELECT a.id, a.nome, a.posicao, a.foto, c.nome as categoria_nome, a.categoria_id,'''
code = code.replace(old_multi, new_multi)

old_pres = '''SELECT p.status, a.nome as atleta_nome
            FROM presencas p'''
new_pres = '''SELECT p.status, a.nome as atleta_nome, a.foto
            FROM presencas p'''
code = code.replace(old_pres, new_pres)

with open("admin_remote.js", "w", encoding="utf-8") as f:
    f.write(code)


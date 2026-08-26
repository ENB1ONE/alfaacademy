const fs = require('fs');
let code = fs.readFileSync('admin.js', 'utf8');

const regex = /if\s*\(modulo\s*===\s*'elenco'\)\s*\{[\s\S]*?else\s*\{\s*return\s*res\.status\(400\)\.json\(\{.*?\}\);\s*\}/;

const safeBlock = `if (modulo === 'elenco') {
            query = "SELECT a.nome, c.nome as categoria, a.posicao, a.status_medico FROM atletas a LEFT JOIN categorias c ON a.categoria_id = c.id WHERE 1=1";
            if (filtros && filtros.categoria) { query += " AND c.nome = $" + count + "::text"; count++; params.push(filtros.categoria); }
            if (filtros && filtros.status_medico) { query += " AND a.status_medico = $" + count + "::text"; count++; params.push(filtros.status_medico); }
            query += " ORDER BY a.nome ASC";
        } 
        else if (modulo === 'presencas') {
            query = "SELECT t.data AS data_treino, p.status, a.nome, c.nome as categoria FROM presencas p JOIN atletas a ON p.atleta_id = a.id LEFT JOIN categorias c ON a.categoria_id = c.id JOIN treinos t ON p.treino_id = t.id WHERE 1=1";
            if (filtros && filtros.categoria) { query += " AND c.nome = $" + count + "::text"; count++; params.push(filtros.categoria); }
            if (filtros && filtros.atleta_id) { query += " AND a.id = $" + count + "::integer"; count++; params.push(filtros.atleta_id); }
            if (filtros && filtros.data_inicio) { query += " AND t.data >= $" + count + "::date"; count++; params.push(filtros.data_inicio); }
            if (filtros && filtros.data_fim) { query += " AND t.data <= $" + count + "::date"; count++; params.push(filtros.data_fim); }
            query += " ORDER BY t.data DESC LIMIT 200";
        }
        else if (modulo === 'jogos') {
            query = "SELECT data_jogo, adversario, categoria, resultado FROM jogos WHERE 1=1";
            if (filtros && filtros.categoria) { query += " AND categoria = $" + count + "::text"; count++; params.push(filtros.categoria); }
            if (filtros && filtros.data_inicio) { query += " AND data_jogo >= $" + count + "::date"; count++; params.push(filtros.data_inicio); }
            if (filtros && filtros.data_fim) { query += " AND data_jogo <= $" + count + "::date"; count++; params.push(filtros.data_fim); }
            query += " ORDER BY data_jogo DESC LIMIT 200";
        } else {
            return res.status(400).json({ success: false, message: 'Módulo inválido.' });
        }`;

if (regex.test(code)) {
    code = code.replace(regex, safeBlock);
    fs.writeFileSync('admin.js', code, 'utf8');
    console.log('Backend patched with date filters.');
}

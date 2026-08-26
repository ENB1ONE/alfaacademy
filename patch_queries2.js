const fs = require('fs');
let code = fs.readFileSync('admin.js', 'utf8');

// Replace the elenco query block
code = code.replace(
    /if \(modulo === 'elenco'\) \{[\s\S]*?else if \(modulo === 'presencas'\)/,
    `if (modulo === 'elenco') {
            query = \`SELECT a.nome, c.nome as categoria, a.posicao, a.status_medico 
                     FROM atletas a 
                     LEFT JOIN categorias c ON a.categoria_id = c.id WHERE 1=1\`;
            if (filtros && filtros.categoria) { query += \` AND c.nome = $\${count++}\`; params.push(filtros.categoria); }
            if (filtros && filtros.status_medico) { query += \` AND a.status_medico = $\${count++}\`; params.push(filtros.status_medico); }
            query += ' ORDER BY a.nome ASC';
        } 
        else if (modulo === 'presencas')`
);

// Replace the presencas query block
code = code.replace(
    /else if \(modulo === 'presencas'\) \{[\s\S]*?else if \(modulo === 'jogos'\)/,
    `else if (modulo === 'presencas') {
            query = \`SELECT t.data AS data_treino, p.status, a.nome, c.nome as categoria 
                     FROM presencas p 
                     JOIN atletas a ON p.atleta_id = a.id 
                     LEFT JOIN categorias c ON a.categoria_id = c.id
                     JOIN treinos t ON p.treino_id = t.id 
                     WHERE 1=1\`;
            if (filtros && filtros.categoria) { query += \` AND c.nome = $\${count++}\`; params.push(filtros.categoria); }
            if (filtros && filtros.atleta_id) { query += \` AND a.id = $\${count++}\`; params.push(filtros.atleta_id); }
            query += ' ORDER BY t.data DESC LIMIT 200';
        }
        else if (modulo === 'jogos')`
);

fs.writeFileSync('admin.js', code, 'utf8');
console.log('admin.js queries fixed');

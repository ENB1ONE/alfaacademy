const fs = require('fs');
let code = fs.readFileSync('/opt/alfa-api/routes/admin.js', 'utf8');

const oldBlock = `        else if (modulo === 'jogos') {
            query = "SELECT t.data AS data_jogo, t.titulo AS adversario, c.nome AS categoria, t.campeonato FROM treinos t LEFT JOIN categorias c ON t.categoria_id = c.id WHERE t.tipo = 'JOGO'";
            if (filtros && filtros.categoria) { query += " AND categoria = $" + count + "::text"; count++; params.push(filtros.categoria); }
            if (filtros && filtros.data_inicio) { query += " AND data_jogo >= $" + count + "::date"; count++; params.push(filtros.data_inicio); }
            if (filtros && filtros.data_fim) { query += " AND data_jogo <= $" + count + "::date"; count++; params.push(filtros.data_fim); }
            query += " ORDER BY t.data DESC LIMIT 200";
        }`;

const newBlock = `        else if (modulo === 'jogos') {
            query = "SELECT t.data AS data_jogo, t.titulo AS adversario, c.nome AS categoria, t.campeonato FROM treinos t LEFT JOIN categorias c ON t.categoria_id = c.id WHERE t.tipo = 'JOGO'";
            if (filtros && filtros.categoria) { query += " AND c.nome = $" + count + "::text"; count++; params.push(filtros.categoria); }
            if (filtros && filtros.data_inicio) { query += " AND t.data >= $" + count + "::date"; count++; params.push(filtros.data_inicio); }
            if (filtros && filtros.data_fim) { query += " AND t.data <= $" + count + "::date"; count++; params.push(filtros.data_fim); }
            query += " ORDER BY t.data DESC LIMIT 200";
        }`;

code = code.replace(oldBlock, newBlock);
fs.writeFileSync('/opt/alfa-api/routes/admin.js', code, 'utf8');
console.log("Block patched.");

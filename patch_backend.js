const fs = require('fs');
let code = fs.readFileSync('/opt/alfa-api/routes/admin.js', 'utf8');

code = code.replace(
    /query = "SELECT data_jogo, adversario, categoria, resultado FROM jogos WHERE 1=1";/,
    `query = "SELECT t.data AS data_jogo, t.titulo AS adversario, c.nome AS categoria, t.campeonato FROM treinos t LEFT JOIN categorias c ON t.categoria_id = c.id WHERE t.tipo = 'JOGO'";`
);

code = code.replace(
    /if \(filtros && filtros\.categoria\) \{ query \+= " AND categoria = \\$" \+ count \+ "::text"; count\+\+; params\.push\(filtros\.categoria\); \}/,
    `if (filtros && filtros.categoria) { query += " AND c.nome = $" + count + "::text"; count++; params.push(filtros.categoria); }`
);

code = code.replace(
    /if \(filtros && filtros\.data_inicio\) \{ query \+= " AND data_jogo >= \\$" \+ count \+ "::date"; count\+\+; params\.push\(filtros\.data_inicio\); \}/,
    `if (filtros && filtros.data_inicio) { query += " AND t.data >= $" + count + "::date"; count++; params.push(filtros.data_inicio); }`
);

code = code.replace(
    /if \(filtros && filtros\.data_fim\) \{ query \+= " AND data_jogo <= \\$" \+ count \+ "::date"; count\+\+; params\.push\(filtros\.data_fim\); \}/,
    `if (filtros && filtros.data_fim) { query += " AND t.data <= $" + count + "::date"; count++; params.push(filtros.data_fim); }`
);

code = code.replace(
    /query \+= " ORDER BY data_jogo DESC LIMIT 200";/,
    `query += " ORDER BY t.data DESC LIMIT 200";`
);

fs.writeFileSync('/opt/alfa-api/routes/admin.js', code, 'utf8');
console.log("Backend query patched successfully.");

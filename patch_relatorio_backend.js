const fs = require('fs');
let code = fs.readFileSync('/opt/alfa-api/routes/admin.js', 'utf8');

const oldBlock = `        else if (modulo === 'jogos') {
            query = "SELECT t.data AS data_jogo, t.titulo AS adversario, c.nome AS categoria, t.campeonato FROM treinos t LEFT JOIN categorias c ON t.categoria_id = c.id WHERE t.tipo = 'JOGO'";`;

const newBlock = `        else if (modulo === 'jogos') {
            query = "SELECT t.data AS data_jogo, t.titulo AS adversario, c.nome AS categoria, t.campeonato, (SELECT json_agg(json_build_object('nome', a.nome, 'convocado', CASE WHEN conv.atleta_id IS NOT NULL THEN true ELSE false END, 'compareceu', CASE WHEN p.status = 'P' THEN true ELSE false END)) FROM atletas a LEFT JOIN convocacoes conv ON conv.atleta_id = a.id AND conv.treino_id = t.id LEFT JOIN presencas p ON p.atleta_id = a.id AND p.treino_id = t.id WHERE conv.atleta_id IS NOT NULL OR p.atleta_id IS NOT NULL) as detalhes FROM treinos t LEFT JOIN categorias c ON t.categoria_id = c.id WHERE t.tipo = 'JOGO'";`;

code = code.replace(oldBlock, newBlock);
fs.writeFileSync('/opt/alfa-api/routes/admin.js', code, 'utf8');
console.log('Backend query for jogos report patched.');

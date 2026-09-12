const fs = require('fs');
let code = fs.readFileSync('admin.js', 'utf8');

const regex = /if \(modulo === 'elenco'\) \{[\s\S]*?query = "SELECT a\.nome, c\.nome as categoria, a\.posicao, a\.status_medico FROM atletas a LEFT JOIN categorias c ON a\.categoria_id = c\.id WHERE 1=1";[\s\S]*?\} \r?\n        else if/g;

const replacement = `if (modulo === 'elenco') {
            query = "SELECT a.nome, c.nome as categoria, a.posicao, a.status_medico FROM atletas a LEFT JOIN categorias c ON a.categoria_id = c.id WHERE a.ativo = true";
            if (filtros && filtros.categoria) { query += " AND c.nome = $" + count + "::text"; count++; params.push(filtros.categoria); }
            if (filtros && filtros.status_medico) { query += " AND a.status_medico = $" + count + "::text"; count++; params.push(filtros.status_medico); }
            query += " ORDER BY a.nome ASC";
        }
        else if (modulo === 'elenco_inativos') {
            query = "SELECT a.nome, c.nome as categoria, a.posicao, a.status_medico, to_char(a.criado_em, 'DD/MM/YYYY') as data_registro FROM atletas a LEFT JOIN categorias c ON a.categoria_id = c.id WHERE a.ativo = false";
            if (filtros && filtros.categoria) { query += " AND c.nome = $" + count + "::text"; count++; params.push(filtros.categoria); }
            query += " ORDER BY a.nome ASC";
        }
        else if`;

if (code.match(regex)) {
    code = code.replace(regex, replacement);
    fs.writeFileSync('admin.js', code, 'utf8');
    console.log("Patched modulo elenco and added elenco_inativos");
} else {
    console.log("Could not find elenco block");
}

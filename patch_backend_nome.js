const fs = require('fs');
let code = fs.readFileSync('admin.js', 'utf8');

const target = `if (filtros && filtros.atleta_id) { query += " AND a.id = $" + count + "::integer"; count++; params.push(filtros.atleta_id); }`;
const replacement = target + `
            if (filtros && filtros.nome_atleta) { query += " AND a.nome ILIKE $" + count + "::text"; count++; params.push('%' + filtros.nome_atleta + '%'); }`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync('admin.js', code, 'utf8');
    console.log('Added nome_atleta to backend');
} else {
    console.log('Target string not found');
}

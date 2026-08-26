const fs = require('fs');
let code = fs.readFileSync('admin.js', 'utf8');

const oldQuery = `query = \`SELECT p.data_treino, p.status, a.nome, a.categoria 
                     FROM presencas_treinos p 
                     JOIN atletas a ON p.atleta_id = a.id WHERE 1=1\`;`;
                     
const newQuery = `query = \`SELECT t.data AS data_treino, p.status, a.nome, a.categoria 
                     FROM presencas p 
                     JOIN atletas a ON p.atleta_id = a.id 
                     JOIN treinos t ON p.treino_id = t.id 
                     WHERE 1=1\`;`;

if (code.includes('presencas_treinos')) {
    code = code.replace(oldQuery, newQuery);
    
    // Also fix the order by field if necessary
    // query += ' ORDER BY p.data_treino DESC LIMIT 200'; 
    // -> query += ' ORDER BY t.data DESC LIMIT 200';
    code = code.replace(`query += ' ORDER BY p.data_treino DESC LIMIT 200';`, `query += ' ORDER BY t.data DESC LIMIT 200';`);
    
    fs.writeFileSync('admin.js', code, 'utf8');
    console.log('Fixed SQL syntax in admin.js');
}

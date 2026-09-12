const fs = require('fs');
let code = fs.readFileSync('admin.js', 'utf8');

// Update GET /atletas using regex
const regex = /SELECT a\.\*, c\.nome as categoria[\s\S]*?LEFT JOIN categorias c ON a\.categoria_id = c\.id[\s\S]*?let values = \[\];[\s\S]*?if \(req\.usuario\.perfil === 'Treinador'\) \{[\s\S]*?JOIN treinador_categoria tc ON tc\.categoria_id = a\.categoria_id[\s\S]*?WHERE tc\.treinador_id = \$1[\s\S]*?values\.push\(req\.usuario\.id\);[\s\S]*?\}/g;

const newGet = `SELECT a.*, c.nome as categoria 
            FROM atletas a 
            LEFT JOIN categorias c ON a.categoria_id = c.id 
            WHERE a.ativo = true
        \`;
        let values = [];

        if (req.usuario.perfil === 'Treinador') {
            query += \`
                AND a.categoria_id IN (SELECT categoria_id FROM treinador_categoria WHERE treinador_id = $1)
            \`;
            values.push(req.usuario.id);
        }`;

code = code.replace(regex, newGet);

fs.writeFileSync('admin.js', code, 'utf8');
console.log('Regex patch applied.');

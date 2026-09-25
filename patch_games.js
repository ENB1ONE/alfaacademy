const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/Games.jsx', 'utf8');

const regex = /setEditingData\(\{ old_titulo: jogo\.adversario, old_data: jogo\.data_raw \}\);\s+titulo: jogo\.adversario,/;
const replacement = `setEditingData({ old_titulo: jogo.adversario, old_data: jogo.data_raw });
    setNewGame({ 
        titulo: jogo.adversario,`;

if (code.match(regex)) {
    code = code.replace(regex, replacement);
    fs.writeFileSync('crm/src/pages/Games.jsx', code, 'utf8');
    console.log('Fixed Games.jsx syntax error');
} else {
    console.log('Regex failed');
}

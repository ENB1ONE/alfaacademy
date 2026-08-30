const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');

const targetStr = "<div className={`bloco-partida ${idx > 0 ? 'nova-pagina' : ''}`} key={`det-${idx}`} style={{ marginTop: '25px' }}>";
const targetStr2 = '<div className={`bloco-partida ${idx > 0 ? \'nova-pagina\' : \'\'}`} key={`det-${idx}`} style={{ marginTop: \'25px\' }}>';

if (code.includes(targetStr)) {
    code = code.replace(targetStr, `<div className="bloco-jogo" key={\`det-\${idx}\`} style={{ marginTop: '25px' }}>`);
} else if (code.includes(targetStr2)) {
    code = code.replace(targetStr2, `<div className="bloco-jogo" key={\`det-\${idx}\`} style={{ marginTop: '25px' }}>`);
} else {
    // Brute force regex
    code = code.replace(/<div className=\{`bloco-partida \$\{idx > 0 \? 'nova-pagina' : ''\}`\} key=\{`det-\$\{idx\}`\} style=\{\{ marginTop: '25px' \}\}>/g, 
    `<div className="bloco-jogo" key={\`det-\${idx}\`} style={{ marginTop: '25px' }}>`);
}

fs.writeFileSync('crm/src/pages/CentralRelatorios.jsx', code, 'utf8');
console.log('bloco-jogo injected.');

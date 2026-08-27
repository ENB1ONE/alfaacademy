const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/Athletes.jsx', 'utf8');

code = code.replace(
    /\{a\.posicao \|\| 'SEM POSIÃ‡ÃƒO'\}/g,
    "{a.posicao ? (a.posicao + (a.posicao_secundaria ? ' / ' + a.posicao_secundaria : '')) : 'SEM POSIÇÃO'}"
);
code = code.replace(
    /\{a\.posicao \|\| 'SEM POSIÇÃO'\}/g,
    "{a.posicao ? (a.posicao + (a.posicao_secundaria ? ' / ' + a.posicao_secundaria : '')) : 'SEM POSIÇÃO'}"
);

fs.writeFileSync('crm/src/pages/Athletes.jsx', code, 'utf8');
console.log('Athletes cards patched.');

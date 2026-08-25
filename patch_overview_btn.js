const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/Overview.jsx', 'utf8');

const regex = /(<span key=\{idx\}[\s\S]*?<\/span>\s*\)\)\s*}\s*<\/div>\s*<\/div>\s*\)\)\s*}\s*<\/div>\s*)\)([\s\S]*?)<\/div>\s*<div className="responsive-grid-2">/i;

const replacement = `$1
        )}
        
        {Object.keys(proximosJogos.reduce((acc, j) => {
            const key = j.data_br + '_' + j.titulo;
            acc[key] = true;
            return acc;
        }, {})).length > 1 && (
            <button 
                onClick={() => setIsJogosExpanded(!isJogosExpanded)}
                style={{
                    marginTop: '15px',
                    width: '100%',
                    padding: '10px',
                    background: 'transparent',
                    color: 'var(--ouro)',
                    border: '1px dashed var(--ouro)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    transition: 'all 0.3s'
                }}
            >
                {isJogosExpanded ? 'Mostrar Menos' : 'Expandir mais ' + (Object.keys(proximosJogos.reduce((acc, j) => { const key = j.data_br + '_' + j.titulo; acc[key] = true; return acc; }, {})).length - 1) + ' Jogos'}
            </button>
        )}
      </div>
        
      <div className="responsive-grid-2">`;

code = code.replace(regex, replacement);
fs.writeFileSync('crm/src/pages/Overview.jsx', code, 'utf8');
console.log('Button added');

const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/Overview.jsx', 'utf8');

const targetStr = `            </div>
        )}
      </div>`;

const newStr = `            </div>
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
                {isJogosExpanded ? 'Mostrar Menos' : 'Expandir ' + (Object.keys(proximosJogos.reduce((acc, j) => { const key = j.data_br + '_' + j.titulo; acc[key] = true; return acc; }, {})).length - 1) + ' Jogos'}
            </button>
        )}
      </div>`;

// Actually we need to make sure we replace exactly after the grid div closes.
// Let's just find the end of the `proximosJogos` block.
// Let's print out the structure first.
console.log(code.substring(code.indexOf('Próximos Jogos'), code.indexOf('Próximos Jogos') + 2000));

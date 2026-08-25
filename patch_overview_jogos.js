const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/Overview.jsx', 'utf8');

if (!code.includes('isJogosExpanded')) {
    // Inject state
    code = code.replace(
        /const \[proximosJogos, setProximosJogos\] = useState\(\[\]\);/,
        `const [proximosJogos, setProximosJogos] = useState([]);\n  const [isJogosExpanded, setIsJogosExpanded] = useState(false);`
    );

    // Group logic is complex, let's extract it to a variable or just slice it inline
    const oldJsx = /\{Object\.values\(proximosJogos\.reduce\([\s\S]*?\}\)\)\.map\(\(j, i\) => \(/;
    
    // We want to slice the Object.values array.
    const replacement = `{Object.values(proximosJogos.reduce((acc, j) => {
    const key = j.data_br + '_' + j.titulo;
    if (!acc[key]) {
        acc[key] = { ...j, categorias_nomes: [j.categoria_nome].filter(Boolean), treino_ids: [j.id] };
    } else {
        if (j.categoria_nome && !acc[key].categorias_nomes.includes(j.categoria_nome)) {
            acc[key].categorias_nomes.push(j.categoria_nome);
        }
        if (!acc[key].treino_ids) acc[key].treino_ids = [acc[key].id];
        if (!acc[key].treino_ids.includes(j.id)) {
            acc[key].treino_ids.push(j.id);
        }
    }
    return acc;
}, {})).slice(0, isJogosExpanded ? undefined : 1).map((j, i) => (`;

    code = code.replace(oldJsx, replacement);

    // Add the "Ver mais" button below the grid
    const endGrid = /<\/div>\s*<\/div>\s*<div className="responsive-grid-2">/i;
    
    const viewMoreBtn = `
                </div>
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
                            border: '1px solid var(--ouro)',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        {isJogosExpanded ? 'Mostrar Menos' : 'Ver Todos os Jogos'}
                    </button>
                )}
            </div>
        </div>
        
        <div className="responsive-grid-2">`;

    // Wait, the regex `<\/div>\s*<\/div>\s*<div className="responsive-grid-2">` might not match exactly.
    // Let's do a replace using a known marker.
}
fs.writeFileSync('crm/src/pages/Overview.jsx', code, 'utf8');
console.log('Overview prepared');

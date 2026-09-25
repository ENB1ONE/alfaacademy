const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');

const regex = /\{modulo === 'presencas' && \([\s\S]*?<label style=\{\{ display: 'block'[\s\S]*?>Atleta Específico<\/label>[\s\S]*?<\/div>[\s\S]*?\)\}/;
const replacement = `{modulo === 'presencas' && (
                        <div style={{ flex: '1 1 200px' }}>
                            <label style={{ display: 'block', marginBottom: 8, color: 'var(--cinza)' }}>Atleta Específico</label>
                            <input 
                                type="text"
                                className="input"
                                placeholder="Buscar por nome..."
                                value={filtros.nome_atleta || ''}
                                onChange={(e) => setFiltros({...filtros, nome_atleta: e.target.value})}
                                style={{ width: '100%' }}
                                list="lista-atletas"
                            />
                            <datalist id="lista-atletas">
                                {atletas && [...new Set(atletas.map(a => a.nome))].sort().map((nome, i) => <option key={i} value={nome} />)}
                            </datalist>
                        </div>
                    )}`;

if (code.match(regex)) {
    code = code.replace(regex, replacement);
    fs.writeFileSync('crm/src/pages/CentralRelatorios.jsx', code, 'utf8');
    console.log('Replaced correctly!');
} else {
    console.log('Not found');
}

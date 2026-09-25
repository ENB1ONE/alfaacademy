const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');

const regex = /\{modulo === 'presencas' && \([\s\S]*?<label[\s\S]*?>Atleta Específico<\/label>[\s\S]*?<select[\s\S]*?>[\s\S]*?<option value="">Todos os Atletas<\/option>[\s\S]*?\{atletas[\s\S]*?\.map\(\(a, i\) => \([\s\S]*?<option key=\{i\} value=\{a\.id\}>\{a\.nome\} \(\{a\.categoria_nome || a\.categoria\}\)<\/option>[\s\S]*?\)\)\}[\s\S]*?<\/select>[\s\S]*?<\/div>[\s\S]*?\)\}/;

const newFilters = `{modulo === 'presencas' && (
                        <>
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
                                    {atletas && atletas.map((a, i) => <option key={i} value={a.nome} />)}
                                </datalist>
                            </div>
                        </>
                    )}`;

if (code.match(regex)) {
    code = code.replace(regex, newFilters);
    fs.writeFileSync('crm/src/pages/CentralRelatorios.jsx', code, 'utf8');
    console.log('Replaced presencas filter with text input');
} else {
    console.log('Could not find presencas filter block');
}

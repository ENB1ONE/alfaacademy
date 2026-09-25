const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');

const target = `{modulo === 'presencas' && (
                        <div style={{ flex: '1 1 200px' }}>
                            <label style={{ display: 'block', marginBottom: 8, color: 'var(--cinza)' }}>Atleta Específico</label>
                            <select className="input" value={filtros.atleta_id || ''} onChange={(e) => setFiltros({...filtros, atleta_id: e.target.value})} style={{ width: '100%' }}>
                                <option value="">Todos os Atletas</option>
                                {atletas
                                  .filter(a => !filtros.categoria || a.categoria_nome === filtros.categoria || a.categoria === filtros.categoria)
                                  .map((a, i) => (
                                    <option key={i} value={a.id}>{a.nome} ({a.categoria_nome || a.categoria})</option>
                                ))}
                            </select>
                        </div>
                    )}`;

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
                                {atletas && atletas.map((a, i) => <option key={i} value={a.nome} />)}
                            </datalist>
                        </div>
                    )}`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync('crm/src/pages/CentralRelatorios.jsx', code, 'utf8');
    console.log('Successfully replaced!');
} else {
    console.log('Target string not found');
}

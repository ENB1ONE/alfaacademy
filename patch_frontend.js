const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');

const oldInput = `<div style={{ flex: '1 1 200px' }}>
                            <label style={{ display: 'block', marginBottom: 8, color: 'var(--cinza)' }}>Atleta Específico (ID)</label>
                            <input type="text" className="input" placeholder="ID do Atleta" value={filtros.atleta_id || ''} onChange={(e) => setFiltros({...filtros, atleta_id: e.target.value})} style={{ width: '100%' }} />
                        </div>`;

const newDropdown = `<div style={{ flex: '1 1 200px' }}>
                            <label style={{ display: 'block', marginBottom: 8, color: 'var(--cinza)' }}>Atleta Específico</label>
                            <select className="input" value={filtros.atleta_id || ''} onChange={(e) => setFiltros({...filtros, atleta_id: e.target.value})} style={{ width: '100%' }}>
                                <option value="">Todos os Atletas</option>
                                {atletas
                                  .filter(a => !filtros.categoria || a.categoria_nome === filtros.categoria || a.categoria === filtros.categoria)
                                  .sort((a,b) => a.nome.localeCompare(b.nome))
                                  .map(a => (
                                    <option key={a.id} value={a.id}>{a.nome}</option>
                                ))}
                            </select>
                        </div>`;

if (code.includes('Atleta Específico (ID)')) {
    code = code.replace(oldInput, newDropdown);
    fs.writeFileSync('crm/src/pages/CentralRelatorios.jsx', code, 'utf8');
    console.log('Frontend patched');
}

const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');

// The blocks to manipulate:
const filterCategoria = `                    {/* Filtros Dinâmicos */}
                    {(modulo === 'elenco' || modulo === 'presencas' || modulo === 'jogos') && (
                        <div style={{ flex: '1 1 200px' }}>
                            <label style={{ display: 'block', marginBottom: 8, color: 'var(--cinza)' }}>Filtrar Categoria</label>
                            <select className="input" value={filtros.categoria || ''} onChange={(e) => setFiltros({...filtros, categoria: e.target.value})} style={{ width: '100%' }}>
                                <option value="">Todas as Categorias</option>
                                {[...new Set(distCategoria.map(c => c.name))].map((c, i) => (
                                    <option key={i} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                    )}`;

const filterAtletaStartIdx = code.indexOf("{modulo === 'presencas' && (");
// To reliably find the end of the `Atleta Específico` block, let's locate the Data Inicial block
const dataInicialIdx = code.indexOf("{(modulo === 'presencas' || modulo === 'jogos') && (");
// And extract everything from filterAtletaStartIdx up to dataInicialIdx
// But wait, there is the `{modulo === 'elenco' && (` block as well. Let's just find the exact block via index.

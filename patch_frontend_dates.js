const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');

// 1. Add date fields right before the submit button in the visual builder
const oldButtonDiv = `<div style={{ flex: '1 1 150px' }}>
                        <button className="btn primary" onClick={handleGerarRelatorio}`;

const dateFields = `{(modulo === 'presencas' || modulo === 'jogos') && (
                        <>
                            <div style={{ flex: '1 1 140px' }}>
                                <label style={{ display: 'block', marginBottom: 8, color: 'var(--cinza)' }}>Data Inicial</label>
                                <input type="date" className="input" value={filtros.data_inicio || ''} onChange={(e) => setFiltros({...filtros, data_inicio: e.target.value})} style={{ width: '100%', colorScheme: 'dark' }} />
                            </div>
                            <div style={{ flex: '1 1 140px' }}>
                                <label style={{ display: 'block', marginBottom: 8, color: 'var(--cinza)' }}>Data Final</label>
                                <input type="date" className="input" value={filtros.data_fim || ''} onChange={(e) => setFiltros({...filtros, data_fim: e.target.value})} style={{ width: '100%', colorScheme: 'dark' }} />
                            </div>
                        </>
                    )}
                    
                    <div style={{ flex: '1 1 150px' }}>
                        <button className="btn primary" onClick={handleGerarRelatorio}`;

code = code.replace(oldButtonDiv, dateFields);

// 2. Format the Date text dynamically in the report header
const oldFiltroText = `{filtros.categoria && <p style={{ margin: '5px 0 0 0', color: '#555', fontSize: '13px', fontWeight: 500 }}>Filtro Aplicado: {filtros.categoria}</p>}`;

const newFiltroText = `{filtros.categoria && <p style={{ margin: '5px 0 0 0', color: '#555', fontSize: '13px', fontWeight: 500 }}>Filtro Categoria: {filtros.categoria}</p>}
                                {filtros.data_inicio && filtros.data_fim && <p style={{ margin: '2px 0 0 0', color: '#555', fontSize: '12px', fontWeight: 500 }}>Período: {new Date(filtros.data_inicio + 'T12:00:00').toLocaleDateString('pt-BR')} a {new Date(filtros.data_fim + 'T12:00:00').toLocaleDateString('pt-BR')}</p>}`;

code = code.replace(oldFiltroText, newFiltroText);

fs.writeFileSync('crm/src/pages/CentralRelatorios.jsx', code, 'utf8');
console.log('Frontend patched with date filters.');

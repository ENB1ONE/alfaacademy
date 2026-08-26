const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');

// 1. Refactor the A4 Header for BI Generator
const oldHeaderStart = `{/* A4 Header */}`;
const oldHeaderRegex = /\{\/\* A4 Header \*\/\}\s*<div style=\{\{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '3px solid #eab308', paddingBottom: '20px', marginBottom: '30px' \}\}>[\s\S]*?<\/div>\s*<\/div>\s*\{\/\* A4 Body \(Table\) \*\/\}/;

const newHeader = `{/* A4 Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '3px solid #eab308', paddingBottom: '20px', marginBottom: '30px', flexWrap: 'nowrap' }}>
                            <div style={{ flex: '0 0 80px' }}>
                                <img src="/alfaacademy/admin/alfa_logo.png" alt="Logo" style={{ width: 65, objectFit: 'contain' }} />
                            </div>
                            <div style={{ flex: 1, paddingLeft: '10px', paddingTop: '5px', textAlign: 'center' }}>
                                <h2 style={{ margin: 0, color: '#111', fontSize: '22px', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '-0.5px' }}>
                                    {modulo === 'elenco' ? 'Relatório de Elenco' : modulo === 'presencas' ? 'Histórico de Presenças' : modulo === 'jogos' ? 'Relatório de Partidas' : 'Relatório Dinâmico'}
                                </h2>
                                {filtros.categoria && <p style={{ margin: '5px 0 0 0', color: '#555', fontSize: '13px', fontWeight: 500 }}>Categoria: {filtros.categoria}</p>}
                                {filtros.atleta_id && (
                                    <p style={{ margin: '2px 0 0 0', color: '#555', fontSize: '13px', fontWeight: 500 }}>
                                        Atleta: {atletas.find(a => a.id.toString() === filtros.atleta_id.toString())?.nome || filtros.atleta_id}
                                    </p>
                                )}
                            </div>
                            <div style={{ flex: '0 0 170px', textAlign: 'right', color: '#6c757d', fontSize: '11px', lineHeight: '1.5', paddingTop: '5px' }}>
                                {filtros.data_inicio && filtros.data_fim && (
                                    <div style={{ marginBottom: 6 }}>
                                        Período:<br/>
                                        <strong style={{ color: '#333', fontSize: '12px' }}>
                                            {new Date(filtros.data_inicio + 'T12:00:00').toLocaleDateString('pt-BR')} a {new Date(filtros.data_fim + 'T12:00:00').toLocaleDateString('pt-BR')}
                                        </strong>
                                    </div>
                                )}
                                Gerado em:<br/>
                                <strong style={{ color: '#333', fontSize: '13px' }}>
                                    {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                </strong>
                            </div>
                        </div>

                        {/* A4 Body (Table) */}`;

code = code.replace(oldHeaderRegex, newHeader);


// 2. Refactor the P and F to Presente and Falta
const oldMapRegex = /\{Object\.values\(row\)\.map\(\(val, i\) => \{[\s\S]*?let displayVal = val;[\s\S]*?if \(typeof val === 'string'/;
const newMap = `{Object.entries(row).map(([key, val], i) => {
                                                let displayVal = val;
                                                
                                                if (key === 'status') {
                                                    if (val === 'P') displayVal = 'Presente';
                                                    else if (val === 'F') displayVal = 'Falta';
                                                }

                                                if (typeof val === 'string'`;

code = code.replace(oldMapRegex, newMap);


fs.writeFileSync('crm/src/pages/CentralRelatorios.jsx', code, 'utf8');
console.log('CentralRelatorios.jsx patched for header and status mapping.');

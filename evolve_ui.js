const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');

const oldHeaderRegex = /\{\/\* A4 Header \*\/\}\s*<div style=\{\{ borderBottom: '3px solid #eab308', paddingBottom: '10px', marginBottom: '15px'[\s\S]*?\{\/\* A4 Body \(Table\) \*\/\}/;
// Actually the previous paddingBottom was changed to '10px' in my previous script? 
// Let's just find "{/* A4 Header */}" up to "{/* A4 Body (Table) */}" using indexOf for safety.

let startIdx = code.indexOf('{/* A4 Header */}');
let endIdx = code.indexOf('{/* A4 Body (Table) */}');

const newHeader = `{/* A4 Header */}
                        <div style={{ borderBottom: '3px solid #eab308', paddingBottom: '15px', marginBottom: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                <div style={{ flex: '0 0 100px' }}>
                                    <img src="/alfaacademy/admin/alfa_logo.png" alt="Logo" style={{ width: 65, objectFit: 'contain' }} />
                                </div>
                                <div style={{ flex: 1, textAlign: 'center' }}>
                                    <h2 style={{ margin: 0, color: '#111', fontSize: '22px', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '-0.5px' }}>
                                        {modulo === 'elenco' ? 'Relatório de Elenco' : modulo === 'presencas' ? 'Histórico de Presenças' : modulo === 'jogos' ? 'Relatório de Partidas' : 'Relatório Dinâmico'}
                                    </h2>
                                </div>
                                <div style={{ flex: '0 0 100px' }}></div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                <div style={{ textAlign: 'left', color: '#555' }}>
                                    {filtros.atleta_id && (
                                        <h3 style={{ margin: '0 0 4px 0', color: '#111', fontSize: '18px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                                            {atletas.find(a => a.id.toString() === filtros.atleta_id.toString())?.nome || filtros.atleta_id}
                                        </h3>
                                    )}
                                    {filtros.categoria && (
                                        <p style={{ margin: 0, fontSize: '13px', fontWeight: 500, color: '#666' }}>
                                            Categoria: {filtros.categoria}
                                        </p>
                                    )}
                                </div>
                                <div style={{ textAlign: 'right', color: '#6c757d', fontSize: '10px', lineHeight: '1.4' }}>
                                    {filtros.data_inicio && filtros.data_fim && (
                                        <div style={{ marginBottom: 4 }}>
                                            Período:<br/>
                                            <strong style={{ color: '#333', fontSize: '12px' }}>
                                                {new Date(filtros.data_inicio + 'T12:00:00').toLocaleDateString('pt-BR')} a {new Date(filtros.data_fim + 'T12:00:00').toLocaleDateString('pt-BR')}
                                            </strong>
                                        </div>
                                    )}
                                    Gerado em:<br/>
                                    <strong style={{ color: '#333', fontSize: '11px' }}>
                                        {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                    </strong>
                                </div>
                            </div>
                        </div>

                        {/* Summary Cards for Presence */}
                        {modulo === 'presencas' && reportData && reportData.length > 0 && filtros.atleta_id && (
                            <div className="section-card" style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                                {(() => {
                                    const total = reportData.length;
                                    const p = reportData.filter(r => r.status === 'P' || r.status === 'Presente').length;
                                    const f = reportData.filter(r => r.status === 'F' || r.status === 'Falta').length;
                                    const freq = total > 0 ? ((p / total) * 100).toFixed(1) : 0;
                                    return (
                                        <>
                                            <div style={{ flex: 1, padding: '15px', background: '#f8f9fa', border: '1px solid #eaeaea', borderRadius: '8px', textAlign: 'center' }}>
                                                <div style={{ fontSize: '11px', color: '#6c757d', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '8px' }}>Total de Treinos</div>
                                                <div style={{ fontSize: '24px', color: '#111', fontWeight: '900' }}>{total}</div>
                                            </div>
                                            <div style={{ flex: 1, padding: '15px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', textAlign: 'center' }}>
                                                <div style={{ fontSize: '11px', color: '#166534', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '8px' }}>Presenças</div>
                                                <div style={{ fontSize: '24px', color: '#15803d', fontWeight: '900' }}>{p}</div>
                                            </div>
                                            <div style={{ flex: 1, padding: '15px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', textAlign: 'center' }}>
                                                <div style={{ fontSize: '11px', color: '#991b1b', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '8px' }}>Faltas</div>
                                                <div style={{ fontSize: '24px', color: '#b91c1c', fontWeight: '900' }}>{f}</div>
                                            </div>
                                            <div style={{ flex: 1, padding: '15px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', textAlign: 'center' }}>
                                                <div style={{ fontSize: '11px', color: '#334155', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '8px' }}>% Frequência</div>
                                                <div style={{ fontSize: '24px', color: freq >= 70 ? '#15803d' : freq >= 50 ? '#b45309' : '#b91c1c', fontWeight: '900' }}>{freq}%</div>
                                            </div>
                                        </>
                                    );
                                })()}
                            </div>
                        )}

                        \n`;

if (startIdx !== -1 && endIdx !== -1) {
    code = code.substring(0, startIdx) + newHeader + code.substring(endIdx);
    console.log("Header replaced");
}

let tableStart = code.indexOf('<table style={{ width: \'100%\', borderCollapse: \'collapse\', marginTop: 20 }}>', endIdx);
let tableEnd = code.indexOf('</table>', tableStart) + 8;

const newTableHead = `
                        {(() => {
                            let columns = Object.keys(reportData[0] || {});
                            if (modulo === 'presencas' && filtros.atleta_id) {
                                columns = columns.filter(c => c !== 'nome' && c !== 'categoria');
                            }
                            return (
                                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20 }}>
                                    <thead>
                                        <tr>
                                            {columns.map((col, i) => (
                                                <th key={i} style={{ width: columns.length === 2 ? '50%' : 'auto' }}>{col.replace(/_/g, ' ')}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reportData.map((row, idx) => (
                                            <tr key={idx}>
                                                {columns.map((key, i) => {
                                                    const val = row[key];
                                                    let displayVal = val;
                                                    
                                                    if (key === 'status') {
                                                        if (val === 'P') displayVal = 'Presente';
                                                        else if (val === 'F') displayVal = 'Falta';
                                                    }

                                                    if (typeof val === 'string' && val.match(/^\\d{4}-\\d{2}-\\d{2}T/)) {
                                                        displayVal = new Date(val).toLocaleDateString('pt-BR');
                                                    }
                                                    displayVal = (displayVal && displayVal.toString().trim() !== '') ? displayVal : '-';
                                                    const emptyClass = displayVal === '-' ? 'empty-cell' : '';
                                                    
                                                    const isNumOrDate = !isNaN(displayVal) || (typeof displayVal === 'string' && displayVal.includes('/'));
                                                    
                                                    return (
                                                        <td key={i} className={emptyClass} style={{ textAlign: isNumOrDate ? 'center' : 'left' }}>
                                                            {displayVal}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            );
                        })()}`;

if (tableStart !== -1 && tableEnd !== -1) {
    code = code.substring(0, tableStart) + newTableHead + code.substring(tableEnd);
    console.log("Table replaced");
} else {
    console.log("Table start", tableStart, "table end", tableEnd);
}

fs.writeFileSync('crm/src/pages/CentralRelatorios.jsx', code, 'utf8');

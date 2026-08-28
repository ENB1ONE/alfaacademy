const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');

const tableStart = code.indexOf('<table>', code.indexOf('Nenhum dado encontrado para os filtros selecionados.'));
const tableEnd = code.indexOf('</table>', tableStart) + 8;

if (tableStart === -1 || tableEnd === -1) {
    console.log("Table not found!");
    process.exit(1);
}

const genericTableCode = code.substring(tableStart, tableEnd);

const jogosBlock = `modulo === 'jogos' ? (
                            <div className="jogos-report">
                                {/* Tabela de Resumo */}
                                <h3 style={{ color: '#111', borderBottom: '2px solid #eee', paddingBottom: 6, marginBottom: 15, fontSize: 16, textTransform: 'uppercase' }}>Resumo de Partidas</h3>
                                <table style={{ tableLayout: 'fixed', width: '100%' }}>
                                    <thead>
                                        <tr>
                                            <th style={{ width: '15%', textAlign: 'center' }}>Data</th>
                                            <th style={{ width: '35%' }}>Adversário</th>
                                            <th style={{ width: '25%' }}>Categoria</th>
                                            <th style={{ width: '25%' }}>Campeonato</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reportData.map((row, idx) => {
                                            const dt = row.data_jogo ? new Date(row.data_jogo).toLocaleDateString('pt-BR') : '-';
                                            return (
                                                <tr key={idx}>
                                                    <td className="num-cell" style={{ textAlign: 'center' }}>{dt}</td>
                                                    <td className="text-cell"><strong>{row.adversario || '-'}</strong></td>
                                                    <td className="text-cell">{row.categoria || '-'}</td>
                                                    <td className="text-cell">{row.campeonato || '-'}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>

                                {/* Detalhamento por Jogo */}
                                {reportData.map((row, idx) => {
                                    const dt = row.data_jogo ? new Date(row.data_jogo).toLocaleDateString('pt-BR') : '-';
                                    const detalhes = row.detalhes || [];
                                    
                                    const totalConvocados = detalhes.filter(d => d.convocado).length;
                                    const totalCompareceram = detalhes.filter(d => d.compareceu).length;

                                    if (detalhes.length === 0) return null;

                                    return (
                                        <div className="section-card" key={\`det-\${idx}\`} style={{ marginTop: '25px', breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                                            <h3 style={{ color: '#111', borderBottom: '2px solid #eee', paddingBottom: 6, marginBottom: 10, fontSize: 14, textTransform: 'uppercase', backgroundColor: '#f8f9fa', padding: '8px' }}>
                                                {dt} - {row.adversario || 'Jogo'}
                                            </h3>
                                            <p style={{ fontSize: '11px', color: '#666', marginBottom: '10px', fontWeight: 'bold' }}>
                                                Convocados: {totalConvocados} | Compareceram: {totalCompareceram}
                                            </p>
                                            <table style={{ tableLayout: 'fixed', width: '100%' }}>
                                                <thead>
                                                    <tr>
                                                        <th style={{ width: '60%' }}>Nome do Atleta</th>
                                                        <th style={{ width: '20%', textAlign: 'center' }}>Convocado</th>
                                                        <th style={{ width: '20%', textAlign: 'center' }}>Compareceu</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {detalhes.map((det, i) => (
                                                        <tr key={i}>
                                                            <td className="text-cell">{det.nome || '-'}</td>
                                                            <td className="num-cell" style={{ textAlign: 'center', color: det.convocado ? '#16a34a' : '#666' }}>
                                                                {det.convocado ? 'Sim' : 'Não'}
                                                            </td>
                                                            <td className="num-cell" style={{ textAlign: 'center', color: det.compareceu ? '#16a34a' : '#dc2626', fontWeight: 'bold' }}>
                                                                {det.compareceu ? 'Presente' : 'Ausente'}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            ${genericTableCode}
                        )`;

code = code.substring(0, tableStart) + jogosBlock + code.substring(tableEnd);
fs.writeFileSync('crm/src/pages/CentralRelatorios.jsx', code, 'utf8');
console.log('CentralRelatorios.jsx patched successfully.');

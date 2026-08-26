const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');

// 1. Remove minHeight: 1123px to fix the extra blank page issue
code = code.replace(/minHeight:\s*'1123px',/g, '');

// 2. Add #a4-preview to the global CSS styles so both reports share the same exact design
const oldStyle = `                  #dashboard-a4-preview {`;
const newStyle = `                  #dashboard-a4-preview, #a4-preview {
                      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                      color: #333333;
                  }
                  #dashboard-a4-preview table, #a4-preview table {
                      width: 100%;
                      border-collapse: collapse;
                      table-layout: fixed;
                      margin-bottom: 25px;
                  }
                  #dashboard-a4-preview th, #a4-preview th {
                      background-color: #111111;
                      color: #eab308;
                      padding: 10px 12px;
                      font-size: 13px;
                      font-weight: bold;
                      text-transform: uppercase;
                      border: 1px solid #000;
                      white-space: normal; word-wrap: break-word; overflow: visible;
                  }
                  #dashboard-a4-preview td, #a4-preview td {
                      padding: 9px 12px;
                      font-size: 12px;
                      color: #333333 !important;
                      border-bottom: 1px solid #dee2e6;
                      border-left: 1px solid #dee2e6;
                      border-right: 1px solid #dee2e6;
                  }
                  #dashboard-a4-preview tr:nth-child(even) td, #a4-preview tr:nth-child(even) td {
                      background-color: #f8f9fa;
                  }
                  #dashboard-a4-preview tr, #a4-preview tr { page-break-inside: avoid; page-break-after: auto; }
                  #dashboard-a4-preview thead, #a4-preview thead { display: table-header-group; }
                  #dashboard-a4-preview tfoot, #a4-preview tfoot { display: table-row-group; }
                  
                  #dashboard-a4-preview {`;

code = code.replace(oldStyle, newStyle);

// 3. Update #a4-preview HTML structure to match the new executive header and layout
const oldA4HeaderStart = `<div id="a4-preview"`;
const oldA4BlockRegex = /<div id="a4-preview"[\s\S]*?Gerado automaticamente via Alfa Academy BI &bull; Confidencial\s*<\/div>\s*<\/div>/;

const newA4Block = `<div id="a4-preview" style={{
                        background: '#ffffff',
                        padding: '40px',
                        boxSizing: 'border-box'
                    }}>
                        {/* A4 Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '3px solid #eab308', paddingBottom: '20px', marginBottom: '30px' }}>
                            <img src="/alfaacademy/admin/alfa_logo.png" alt="Logo" style={{ width: 65, objectFit: 'contain' }} />
                            <div style={{ flex: 1, paddingLeft: '20px', paddingTop: '5px', textAlign: 'center' }}>
                                <h2 style={{ margin: 0, color: '#111', fontSize: '22px', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '-0.5px' }}>
                                    {modulo === 'elenco' ? 'Relatório de Elenco' : modulo === 'presencas' ? 'Histórico de Presenças' : modulo === 'jogos' ? 'Relatório de Partidas' : 'Relatório Dinâmico'}
                                </h2>
                                {filtros.categoria && <p style={{ margin: '5px 0 0 0', color: '#555', fontSize: '13px', fontWeight: 500 }}>Filtro Aplicado: {filtros.categoria}</p>}
                            </div>
                            <div style={{ textAlign: 'right', color: '#6c757d', fontSize: '11px', lineHeight: '1.5', paddingTop: '5px', minWidth: '150px' }}>
                                Gerado em:<br/>
                                <strong style={{ color: '#333', fontSize: '13px' }}>
                                    {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                </strong>
                            </div>
                        </div>

                        {/* A4 Body (Table) */}
                        {!reportData ? (
                            <div style={{ textAlign: 'center', color: '#999', marginTop: 100, fontStyle: 'italic' }}>
                                Configure os filtros acima e clique em "Gerar Visualização"
                            </div>
                        ) : reportData.length === 0 ? (
                            <div style={{ textAlign: 'center', color: '#999', marginTop: 100, fontStyle: 'italic' }}>
                                Nenhum dado encontrado para os filtros selecionados.
                            </div>
                        ) : (
                            <table>
                                <thead>
                                    <tr>
                                        {Object.keys(reportData[0]).map(key => (
                                            <th key={key}>
                                                {key.replace(/_/g, ' ')}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {reportData.map((row, idx) => (
                                        <tr key={idx}>
                                            {Object.values(row).map((val, i) => {
                                                let displayVal = val;
                                                if (typeof val === 'string' && val.match(/^\\d{4}-\\d{2}-\\d{2}T/)) {
                                                    displayVal = new Date(val).toLocaleDateString('pt-BR');
                                                }
                                                displayVal = (displayVal && displayVal.toString().trim() !== '') ? displayVal : '-';
                                                const emptyClass = displayVal === '-' ? 'empty-cell' : '';
                                                
                                                // Center numbers and dates, left-align text
                                                const isNumOrDate = !isNaN(displayVal) || (typeof displayVal === 'string' && displayVal.includes('/'));
                                                
                                                return (
                                                    <td key={i} className={emptyClass} style={{ textAlign: isNumOrDate ? 'center' : 'left' }}>
                                                        {displayVal}
                                                    </td>
                                                )
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                        
                        {/* A4 Footer */}
                        <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #ddd', textAlign: 'center', color: '#888', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Documento Confidencial • Gerado automaticamente via Alfa Academy BI
                        </div>
                    </div>`;

code = code.replace(oldA4BlockRegex, newA4Block);

// 4. Update the exportPDF function to use the same advanced html2pdf config as exportDashboardPDF
const oldExportPDF = /const exportPDF = \(\) => \{[\s\S]*?html2pdf\(\)\.from\(element\)\.set\(opt\)\.save\(\);\s*\};/;
const newExportPDF = `const exportPDF = () => {
    const element = document.getElementById('a4-preview');
    if (!element) return;
    const opt = {
      margin:       [10, 10, 15, 10],
      filename:     \`Relatorio_\${modulo}_\${new Date().getTime()}.pdf\`,
      image:        { type: 'jpeg', quality: 1 },
      html2canvas:  { scale: 2, useCORS: true, windowWidth: 900 },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak:    { mode: ['css', 'legacy'] }
    };
    html2pdf().from(element).set(opt).save();
  };`;

code = code.replace(oldExportPDF, newExportPDF);

// 5. Ensure the preview container has the correct wrapper so it renders the width nicely on screen too
code = code.replace(/maxWidth: '794px', \/\/ A4 Width at 96 DPI/g, `maxWidth: '900px',`);

fs.writeFileSync('crm/src/pages/CentralRelatorios.jsx', code, 'utf8');
console.log('BI Generator successfully refactored to match Executive design and fix blank pages.');

const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');

// Find the start and end of the hidden report div
const startIdx = code.indexOf('{/* HIDDEN EXECUTIVE DASHBOARD REPORT */}');
const endIdx = code.indexOf('</div></div><div className="responsive-grid-2">');

if (startIdx !== -1 && endIdx !== -1) {
    const newReportCode = `{/* HIDDEN EXECUTIVE DASHBOARD REPORT */}
      <div style={{ position: 'absolute', top: '-9999px', left: '-9999px', zIndex: -100 }}>
          <div id="dashboard-a4-preview" style={{
              width: '794px',
              minHeight: '1123px',
              background: '#ffffff',
              padding: '40px',
              boxSizing: 'border-box'
          }}>
              <style>
                  {\`
                  #dashboard-a4-preview {
                      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                      color: #333333;
                  }
                  #dashboard-a4-preview table {
                      width: 100%;
                      border-collapse: collapse;
                      table-layout: fixed;
                      margin-bottom: 25px;
                  }
                  #dashboard-a4-preview th {
                      background-color: #111111;
                      color: #eab308;
                      padding: 10px 12px;
                      font-size: 13px;
                      font-weight: bold;
                      text-transform: uppercase;
                      border: 1px solid #000;
                  }
                  #dashboard-a4-preview td {
                      padding: 9px 12px;
                      font-size: 12px;
                      color: #333333 !important;
                      border-bottom: 1px solid #dee2e6;
                      border-left: 1px solid #dee2e6;
                      border-right: 1px solid #dee2e6;
                  }
                  #dashboard-a4-preview tr:nth-child(even) td {
                      background-color: #f8f9fa;
                  }
                  #dashboard-a4-preview .text-cell {
                      white-space: nowrap;
                      overflow: hidden;
                      text-overflow: ellipsis;
                      text-align: left;
                  }
                  #dashboard-a4-preview .num-cell {
                      text-align: center;
                  }
                  #dashboard-a4-preview .cap-text {
                      text-transform: capitalize;
                  }
                  .empty-cell {
                      color: #999 !important;
                      font-style: italic;
                  }
                  \`}
              </style>

              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '3px solid #eab308', paddingBottom: '20px', marginBottom: '30px' }}>
                  <img src="/alfaacademy/admin/alfa_logo.png" alt="Logo" style={{ width: 65, objectFit: 'contain' }} />
                  <div style={{ flex: 1, paddingLeft: '20px', paddingTop: '5px' }}>
                      <h2 style={{ margin: 0, color: '#111', fontSize: '22px', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '-0.5px' }}>
                          Dashboard de Performance e Gestão de Atletas
                      </h2>
                      <p style={{ margin: '5px 0 0 0', color: '#555', fontSize: '13px', fontWeight: 500 }}>Relatório Analítico Executivo</p>
                  </div>
                  <div style={{ textAlign: 'right', color: '#6c757d', fontSize: '11px', lineHeight: '1.5', paddingTop: '5px' }}>
                      Gerado em:<br/>
                      <strong style={{ color: '#333', fontSize: '13px' }}>
                          {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </strong>
                  </div>
              </div>

              {/* Distribuição por Categoria */}
              <div>
                  <h3 style={{ color: '#111', borderBottom: '2px solid #eee', paddingBottom: 6, marginBottom: 15, fontSize: 16, textTransform: 'uppercase' }}>Distribuição por Categoria</h3>
                  <table>
                      <thead>
                          <tr>
                              <th className="text-cell" style={{ width: '25%' }}>Categoria</th>
                              <th className="num-cell" style={{ width: '15%' }}>Total</th>
                              <th className="num-cell" style={{ width: '20%' }}>Novos (30 dias)</th>
                              <th className="num-cell" style={{ width: '20%' }}>Desligamentos</th>
                              <th className="num-cell" style={{ width: '20%' }}>Saldo</th>
                          </tr>
                      </thead>
                      <tbody>
                          {distCategoria.map((cat, i) => {
                              const catAtletas = atletas.filter(a => (a.categoria_nome || a.categoria || '') === cat.name);
                              const novos = catAtletas.filter(a => {
                                  if(!a.criado_em) return false;
                                  const diffDays = Math.ceil(Math.abs(new Date() - new Date(a.criado_em)) / (1000 * 60 * 60 * 24)); 
                                  return diffDays <= 30;
                              }).length;
                              
                              const displayCat = cat.name && cat.name.trim() !== '' ? cat.name : '-';
                              const emptyClass = displayCat === '-' ? ' empty-cell' : '';

                              return (
                                  <tr key={i}>
                                      <td className={\`text-cell cap-text\${emptyClass}\`} title={displayCat}><strong>{displayCat}</strong></td>
                                      <td className="num-cell">{cat.total}</td>
                                      <td className="num-cell" style={{ color: novos > 0 ? '#16a34a' : '#333', fontWeight: novos > 0 ? 'bold' : 'normal' }}>
                                          {novos > 0 ? \`↑ \${novos}\` : '0'}
                                      </td>
                                      <td className="num-cell empty-cell">-</td>
                                      <td className="num-cell" style={{ fontWeight: 'bold' }}>{cat.total}</td>
                                  </tr>
                              );
                          })}
                      </tbody>
                  </table>
              </div>

              {/* Status Médico (Lesionados) */}
              <div>
                  <h3 style={{ color: '#111', borderBottom: '2px solid #eee', paddingBottom: 6, marginBottom: 15, fontSize: 16, textTransform: 'uppercase' }}>Departamento Médico (Lesionados)</h3>
                  {atletas.filter(a => a.status_medico === 'Lesionado').length > 0 ? (
                      <table>
                          <thead>
                              <tr>
                                  <th className="text-cell" style={{ width: '30%' }}>Atleta</th>
                                  <th className="text-cell" style={{ width: '15%' }}>Categoria</th>
                                  <th className="text-cell" style={{ width: '15%' }}>Posição</th>
                                  <th className="num-cell" style={{ width: '15%' }}>Data Registro</th>
                                  <th className="text-cell" style={{ width: '15%' }}>Tipo Lesão</th>
                                  <th className="num-cell" style={{ width: '10%' }}>Status</th>
                              </tr>
                          </thead>
                          <tbody>
                              {atletas.filter(a => a.status_medico === 'Lesionado').map((a, i) => {
                                  const nome = (a.nome && a.nome.trim() !== '') ? a.nome : '-';
                                  const cat = (a.categoria_nome || a.categoria || '').trim() !== '' ? (a.categoria_nome || a.categoria) : '-';
                                  const pos = (a.posicao && a.posicao.trim() !== '') ? a.posicao : '-';
                                  const dt = a.criado_em ? new Date(a.criado_em).toLocaleDateString('pt-BR') : '-';
                                  
                                  return (
                                      <tr key={i}>
                                          <td className={\`text-cell\${nome === '-' ? ' empty-cell' : ''}\`}><strong>{nome}</strong></td>
                                          <td className={\`text-cell cap-text\${cat === '-' ? ' empty-cell' : ''}\`}>{cat}</td>
                                          <td className={\`text-cell cap-text\${pos === '-' ? ' empty-cell' : ''}\`}>{pos}</td>
                                          <td className={\`num-cell\${dt === '-' ? ' empty-cell' : ''}\`}>{dt}</td>
                                          <td className="num-cell empty-cell">-</td>
                                          <td className="num-cell" style={{ color: '#dc2626', fontWeight: 'bold' }}>Lesionado</td>
                                      </tr>
                                  );
                              })}
                          </tbody>
                      </table>
                  ) : (
                      <p style={{ color: '#16a34a', fontWeight: 'bold', fontSize: 13, padding: '10px 0', marginBottom: 25 }}>Nenhum atleta lesionado no momento. DM Vazio.</p>
                  )}
              </div>

              {/* Mapeamento Tático & Top Faltosos (Side by side for better A4 usage) */}
              <div style={{ display: 'flex', gap: '30px' }}>
                  
                  {/* Mapeamento Tático */}
                  <div style={{ flex: 1 }}>
                      <h3 style={{ color: '#111', borderBottom: '2px solid #eee', paddingBottom: 6, marginBottom: 15, fontSize: 16, textTransform: 'uppercase' }}>Mapeamento Tático</h3>
                      <table>
                          <thead>
                              <tr>
                                  <th className="text-cell" style={{ width: '70%' }}>Posição</th>
                                  <th className="num-cell" style={{ width: '30%' }}>Atletas</th>
                              </tr>
                          </thead>
                          <tbody>
                              {Array.from(new Set(atletas.map(a => (a.posicao && a.posicao.trim() !== '') ? a.posicao : '-'))).sort().map((pos, i) => {
                                  const qtd = atletas.filter(a => ((a.posicao && a.posicao.trim() !== '') ? a.posicao : '-') === pos).length;
                                  return (
                                      <tr key={i}>
                                          <td className={\`text-cell cap-text\${pos === '-' ? ' empty-cell' : ''}\`}><strong>{pos}</strong></td>
                                          <td className="num-cell">{qtd}</td>
                                      </tr>
                                  );
                              })}
                          </tbody>
                      </table>
                  </div>

                  {/* Faltosos */}
                  <div style={{ flex: 1 }}>
                      <h3 style={{ color: '#111', borderBottom: '2px solid #eee', paddingBottom: 6, marginBottom: 15, fontSize: 16, textTransform: 'uppercase' }}>Índice de Ausências</h3>
                      {faltosos.length > 0 ? (
                          <table>
                              <thead>
                                  <tr>
                                      <th className="text-cell" style={{ width: '75%' }}>Atleta</th>
                                      <th className="num-cell" style={{ width: '25%' }}>Faltas</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  {faltosos.map((f, i) => {
                                      const nome = (f.nome && f.nome.trim() !== '') ? f.nome : '-';
                                      return (
                                          <tr key={i}>
                                              <td className={\`text-cell\${nome === '-' ? ' empty-cell' : ''}\`}><strong>{nome}</strong></td>
                                              <td className="num-cell" style={{ color: '#dc2626', fontWeight: 'bold' }}>{f.faltas}</td>
                                          </tr>
                                      );
                                  })}
                              </tbody>
                          </table>
                      ) : (
                          <p style={{ color: '#6c757d', fontSize: 13, fontStyle: 'italic', padding: '10px 0' }}>Nenhum registro de falta.</p>
                      )}
                  </div>
              </div>

              {/* Footer */}
              <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #ddd', textAlign: 'center', color: '#888', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Documento Confidencial • Gerado automaticamente via Alfa Academy BI
              </div>
          </div>
      </div>\n`;

    const finalCode = code.substring(0, startIdx) + newReportCode + code.substring(endIdx);
    fs.writeFileSync('crm/src/pages/CentralRelatorios.jsx', finalCode, 'utf8');
    console.log('UI/UX Refactoring injected successfully.');
} else {
    console.log('Could not find boundaries.');
}

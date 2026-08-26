const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');

// 1. Update PieChart colors for Status Médico
const oldPieChartMed = `<PieChart>
                        <Pie data={distMedico} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} label>
                          {distMedico.map((entry, index) => <Cell key={"cell-" + index} fill={COLORS[index % COLORS.length]} />)}
                        </Pie>
                        <RechartsTooltip contentStyle={{ background: '#1e1e24', border: 'none', borderRadius: 8 }} />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                      </PieChart>`;

const newPieChartMed = `<PieChart>
                        <Pie data={distMedico} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} label>
                          {distMedico.map((entry, index) => <Cell key={"cell-" + index} fill={entry.name === 'Apto' ? '#22c55e' : entry.name === 'Lesionado' ? '#ef4444' : COLORS[index % COLORS.length]} />)}
                        </Pie>
                        <RechartsTooltip contentStyle={{ background: '#1e1e24', border: 'none', borderRadius: 8 }} />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                      </PieChart>`;

code = code.replace(oldPieChartMed, newPieChartMed);

// 2. Add Export function for Dashboard
const exportFuncs = `
  const exportDashboardPDF = () => {
    const element = document.getElementById('dashboard-a4-preview');
    if (!element) return;
    
    // Temporarily make it block for html2canvas to render
    const origDisplay = element.style.display;
    element.style.display = 'block';
    
    const opt = {
      margin:       10,
      filename:     \`Dashboard_Executivo_\${new Date().getTime()}.pdf\`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    html2pdf().from(element).set(opt).save().then(() => {
        element.style.display = origDisplay;
    });
  };
`;

code = code.replace(/const exportPDF = \(\) => \{/, exportFuncs + '\n  const exportPDF = () => {');

// 3. Replace window.print() button
const oldPrintBtn = `<button className="btn primary" onClick={() => window.print()} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Printer size={18} /> Imprimir Tela
            </button>`;

const newPrintBtn = `<button className="btn primary" onClick={exportDashboardPDF} style={{ display: 'flex', gap: 8, alignItems: 'center', background: 'var(--ouro)', color: '#000', fontWeight: 'bold' }}>
              <Download size={18} /> Baixar Relatório Executivo
            </button>`;

code = code.replace(oldPrintBtn, newPrintBtn);

// 4. Add the hidden A4 template at the end of the return statement
// We need to carefully inject it just before the final `</div>`

// Build complex data for the report
const hiddenTemplate = `
      {/* HIDDEN EXECUTIVE DASHBOARD REPORT */}
      <div style={{ display: 'none' }}>
          <div id="dashboard-a4-preview" style={{
              width: '794px',
              minHeight: '1123px',
              background: '#ffffff',
              padding: '40px',
              color: '#333333',
              fontFamily: 'Arial, sans-serif',
              boxSizing: 'border-box'
          }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #eab308', paddingBottom: '20px', marginBottom: '30px' }}>
                  <div>
                      <img src="/alfaacademy/admin/alfa_logo.png" alt="Logo" style={{ width: 70, background: 'transparent' }} />
                  </div>
                  <div style={{ textAlign: 'center' }}>
                      <h2 style={{ margin: 0, color: '#111', fontSize: '24px', textTransform: 'uppercase', fontWeight: 800 }}>
                          Relatório Analítico Executivo
                      </h2>
                      <p style={{ margin: '5px 0 0 0', color: '#555', fontSize: '14px' }}>Dashboard de Performance e Gestão</p>
                  </div>
                  <div style={{ textAlign: 'right', color: '#666', fontSize: '12px' }}>
                      Emissão:<br/>
                      {new Date().toLocaleDateString('pt-BR')} <br/>
                      {new Date().toLocaleTimeString('pt-BR')}
                  </div>
              </div>

              {/* Distribuição por Categoria */}
              <div style={{ marginBottom: 30 }}>
                  <h3 style={{ color: '#000', borderBottom: '1px solid #ddd', paddingBottom: 5, marginBottom: 15, fontSize: 18 }}>Distribuição por Categoria</h3>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                      <thead>
                          <tr style={{ background: '#f5f5f5' }}>
                              <th style={{ padding: 8, textAlign: 'left', borderBottom: '2px solid #ccc' }}>Categoria</th>
                              <th style={{ padding: 8, textAlign: 'center', borderBottom: '2px solid #ccc' }}>Total de Atletas</th>
                              <th style={{ padding: 8, textAlign: 'center', borderBottom: '2px solid #ccc' }}>Novos (30 dias)</th>
                          </tr>
                      </thead>
                      <tbody>
                          {distCategoria.map((cat, i) => {
                              const catAtletas = atletas.filter(a => (a.categoria_nome || a.categoria || 'Sem Cat.') === cat.name);
                              const novos = catAtletas.filter(a => {
                                  if(!a.criado_em) return false;
                                  const date = new Date(a.criado_em);
                                  const diffTime = Math.abs(new Date() - date);
                                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
                                  return diffDays <= 30;
                              }).length;
                              return (
                                  <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                                      <td style={{ padding: 8, fontWeight: 'bold' }}>{cat.name}</td>
                                      <td style={{ padding: 8, textAlign: 'center' }}>{cat.total}</td>
                                      <td style={{ padding: 8, textAlign: 'center', color: novos > 0 ? '#22c55e' : '#999', fontWeight: 'bold' }}>
                                          {novos > 0 ? \`+\${novos}\` : '0'}
                                      </td>
                                  </tr>
                              );
                          })}
                      </tbody>
                  </table>
              </div>

              {/* Status Médico (Lesionados) */}
              <div style={{ marginBottom: 30 }}>
                  <h3 style={{ color: '#000', borderBottom: '1px solid #ddd', paddingBottom: 5, marginBottom: 15, fontSize: 18 }}>Departamento Médico (Lesionados)</h3>
                  {atletas.filter(a => a.status_medico === 'Lesionado').length > 0 ? (
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                          <thead>
                              <tr style={{ background: '#fef2f2', color: '#b91c1c' }}>
                                  <th style={{ padding: 8, textAlign: 'left', borderBottom: '2px solid #f87171' }}>Atleta</th>
                                  <th style={{ padding: 8, textAlign: 'left', borderBottom: '2px solid #f87171' }}>Categoria</th>
                                  <th style={{ padding: 8, textAlign: 'left', borderBottom: '2px solid #f87171' }}>Posição</th>
                                  <th style={{ padding: 8, textAlign: 'center', borderBottom: '2px solid #f87171' }}>Data Registro</th>
                              </tr>
                          </thead>
                          <tbody>
                              {atletas.filter(a => a.status_medico === 'Lesionado').map((a, i) => (
                                  <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                                      <td style={{ padding: 8, fontWeight: 'bold', color: '#ef4444' }}>{a.nome}</td>
                                      <td style={{ padding: 8 }}>{a.categoria_nome || a.categoria}</td>
                                      <td style={{ padding: 8 }}>{a.posicao || '-'}</td>
                                      <td style={{ padding: 8, textAlign: 'center' }}>{a.criado_em ? new Date(a.criado_em).toLocaleDateString('pt-BR') : 'Não informada'}</td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  ) : (
                      <p style={{ color: '#22c55e', fontWeight: 'bold', fontSize: 14 }}>Nenhum atleta lesionado no momento.</p>
                  )}
              </div>

              {/* Top Atletas Faltosos */}
              <div style={{ marginBottom: 30 }}>
                  <h3 style={{ color: '#000', borderBottom: '1px solid #ddd', paddingBottom: 5, marginBottom: 15, fontSize: 18 }}>Índice de Faltas (Top Ausentes)</h3>
                  {faltosos.length > 0 ? (
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                          <thead>
                              <tr style={{ background: '#fffbeb', color: '#b45309' }}>
                                  <th style={{ padding: 8, textAlign: 'left', borderBottom: '2px solid #fbbf24' }}>Atleta</th>
                                  <th style={{ padding: 8, textAlign: 'center', borderBottom: '2px solid #fbbf24' }}>Total de Faltas</th>
                              </tr>
                          </thead>
                          <tbody>
                              {faltosos.map((f, i) => (
                                  <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                                      <td style={{ padding: 8, fontWeight: 'bold' }}>{f.nome}</td>
                                      <td style={{ padding: 8, textAlign: 'center', color: '#ef4444', fontWeight: 'bold' }}>{f.faltas}</td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  ) : (
                      <p style={{ color: '#999', fontSize: 14 }}>Nenhum registro de falta.</p>
                  )}
              </div>

              {/* Distribuição por Posição Detalhada */}
              <div style={{ marginBottom: 30 }}>
                  <h3 style={{ color: '#000', borderBottom: '1px solid #ddd', paddingBottom: 5, marginBottom: 15, fontSize: 18 }}>Mapeamento Tático (Atletas por Posição)</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                      {Array.from(new Set(atletas.map(a => a.posicao || 'Sem Posição'))).sort().map((pos, i) => {
                          const atletasPos = atletas.filter(a => (a.posicao || 'Sem Posição') === pos);
                          return (
                              <div key={i} style={{ background: '#fafafa', padding: 15, borderRadius: 8, border: '1px solid #eaeaea' }}>
                                  <h4 style={{ margin: '0 0 10px 0', color: '#06b6d4', display: 'flex', justifyContent: 'space-between' }}>
                                      <span>{pos}</span>
                                      <span style={{ color: '#999', fontSize: 12 }}>{atletasPos.length} atleta(s)</span>
                                  </h4>
                                  <ul style={{ margin: 0, paddingLeft: 20, fontSize: 11, color: '#444' }}>
                                      {atletasPos.map((a, idx) => (
                                          <li key={idx}><strong>{a.nome}</strong> <span style={{ color: '#888' }}>({a.categoria_nome || a.categoria || 'Sem Cat.'})</span></li>
                                      ))}
                                  </ul>
                              </div>
                          )
                      })}
                  </div>
              </div>

              {/* Footer */}
              <div style={{ marginTop: '50px', paddingTop: '20px', borderTop: '1px solid #eee', textAlign: 'center', color: '#999', fontSize: '10px' }}>
                  Gerado automaticamente via Alfa Academy BI • Confidencial
              </div>
          </div>
      </div>
`;

code = code.replace(/<\/div>\s*<\/div>\s*<div className="responsive-grid-2">/, `</div></div><div className="responsive-grid-2">`); // just to clean up any spacing if needed
code = code.replace(/    <\/div>\s*  \);\s*\}\s*$/g, hiddenTemplate + `    </div>\n  );\n}`);

fs.writeFileSync('crm/src/pages/CentralRelatorios.jsx', code, 'utf8');
console.log('Dashboard Report successfully rewritten');

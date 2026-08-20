const fs = require('fs');
let content = fs.readFileSync('crm/src/pages/AttendanceReport.jsx', 'utf8');

const oldGrid = `<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.9rem', background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '10px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ color: 'var(--cinza)', fontSize: '0.8rem' }}>Chamadas</span>
                  <strong style={{ fontSize: '1.1rem' }}>{r.total_eventos}</strong>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ color: 'var(--cinza)', fontSize: '0.8rem' }}>Convocado</span>
                  <strong style={{ fontSize: '1.1rem', color: 'var(--ouro)' }}>{r.total_convocacoes || 0}</strong>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderTop: '1px solid var(--linha)', paddingTop: '10px' }}>
                  <span style={{ color: 'var(--cinza)', fontSize: '0.8rem' }}>Presenças</span>
                  <strong style={{ fontSize: '1.1rem', color: '#10B981' }}>{r.total_presencas}</strong>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderTop: '1px solid var(--linha)', paddingTop: '10px' }}>
                  <span style={{ color: 'var(--cinza)', fontSize: '0.8rem' }}>Faltas</span>
                  <strong style={{ fontSize: '1.1rem', color: '#EF4444' }}>{r.total_faltas}</strong>
                </div>
              </div>`;

const newGrid = `
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--cinza)' }}>Total de Eventos: <strong>{r.total_eventos}</strong></span>
                  <span style={{ color: 'var(--cinza)' }}>Convocado: <strong>{r.total_convocacoes || 0}</strong></span>
                </div>
                
                {/* Barras de Progresso */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {/* Barra Presença */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '40px', fontSize: '0.8rem', color: '#10B981', fontWeight: 'bold' }}>
                      {r.total_presencas} P
                    </div>
                    <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', height: '12px', borderRadius: '6px', overflow: 'hidden' }}>
                      <div style={{ width: \`\${(r.total_presencas / Math.max(1, r.total_convocacoes || r.total_eventos)) * 100}%\`, background: '#10B981', height: '100%', borderRadius: '6px' }} />
                    </div>
                  </div>
                  
                  {/* Barra Ausência */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '40px', fontSize: '0.8rem', color: '#EF4444', fontWeight: 'bold' }}>
                      {r.total_faltas} F
                    </div>
                    <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', height: '12px', borderRadius: '6px', overflow: 'hidden' }}>
                      <div style={{ width: \`\${(r.total_faltas / Math.max(1, r.total_convocacoes || r.total_eventos)) * 100}%\`, background: '#EF4444', height: '100%', borderRadius: '6px' }} />
                    </div>
                  </div>
                </div>
              </div>
`;

content = content.replace(oldGrid, newGrid);

// Also remove the old overall percentage circle/pill
content = content.replace(
    `<div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: 20, color: getColor(r.total_presencas, r.total_eventos), fontWeight: 'bold', fontSize: '1.1rem' }}>
                    {getPercentage(r.total_presencas, r.total_eventos)}
                </div>`,
    ""
);

fs.writeFileSync('crm/src/pages/AttendanceReport.jsx', content, 'utf8');
console.log('AttendanceReport.jsx updated');

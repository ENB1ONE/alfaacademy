const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/AttendanceReport.jsx', 'utf8');

const oldTitle = `<div>
                  <h3 style={{ margin: 0, color: 'var(--ouro)', fontSize: '1.2rem' }}>{r.nome}</h3>
                  <span style={{ fontSize: '0.85rem', color: 'var(--cinza)' }}>{r.categoria_nome || 'Sem Categoria'}</span>
                </div>`;

const newTitle = `<div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--ouro)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 18, flexShrink: 0, overflow: 'hidden' }}>
                    {r.foto ? <img src={r.foto} alt={r.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (r.nome ? r.nome.charAt(0) : '')}
                  </div>
                  <div>
                    <h3 style={{ margin: 0, color: 'var(--ouro)', fontSize: '1.2rem' }}>{r.nome}</h3>
                    <span style={{ fontSize: '0.85rem', color: 'var(--cinza)' }}>{r.categoria_nome || 'Sem Categoria'}</span>
                  </div>
                </div>`;

code = code.replace(oldTitle, newTitle);
fs.writeFileSync('crm/src/pages/AttendanceReport.jsx', code, 'utf8');

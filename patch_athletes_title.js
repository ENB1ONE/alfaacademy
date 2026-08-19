const fs = require('fs');
let ath = fs.readFileSync('crm/src/pages/Athletes.jsx', 'utf8');

const oldTitle = `<div>
                  <h3 style={{ margin: 0, color: 'var(--ouro)', fontSize: '1.2rem' }}>{a.nome}</h3>
                  <span style={{ fontSize: '0.85rem', color: 'var(--cinza)' }}>{a.posicao || 'Sem posiÃ§Ã£o'}</span>
                </div>`;
const newTitle = `<div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--ouro)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 18, flexShrink: 0, overflow: 'hidden' }}>
                    {a.foto ? <img src={a.foto} alt={a.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : a.nome.charAt(0)}
                  </div>
                  <div>
                    <h3 style={{ margin: 0, color: 'var(--ouro)', fontSize: '1.2rem' }}>{a.nome}</h3>
                    <span style={{ fontSize: '0.85rem', color: 'var(--cinza)' }}>{a.posicao || 'Sem posição'}</span>
                  </div>
                </div>`;

ath = ath.replace(oldTitle, newTitle);
fs.writeFileSync('crm/src/pages/Athletes.jsx', ath, 'utf8');
console.log("Athletes.jsx title patched");

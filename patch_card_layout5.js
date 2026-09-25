const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/Athletes.jsx', 'utf8');

let startStr = '<div className="card" key={a.id}';
let startIdx = code.indexOf(startStr);
let endStr = "{a.status_medico || 'Apto'}\n                    </span>\n                  </div>\n                </div>\n              </div>";

let endIdx = code.indexOf("{a.status_medico || 'Apto'}");
// Add the length to get the real end
// Let's just find the index of '))' after endIdx
let loopEndIdx = code.indexOf('))', endIdx);
const originalBlock = code.substring(startIdx, loopEndIdx);

const newBlock = `<div className="card" key={a.id} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px', border: '1px solid rgba(255,255,255,0.05)' }}>
                {/* Header Row: Avatar + Name + Position */}
                <div style={{ display: 'flex', gap: 15, alignItems: 'center' }}>
                  <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--ouro)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: 20, flexShrink: 0, overflow: 'hidden', cursor: 'pointer', border: '2px solid rgba(234,179,8,0.3)' }} onClick={() => navigate(\`/perfil/\${a.id}\`)}>
                    {a.foto ? <img src={a.foto} alt={a.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (a.nome ? String(a.nome).charAt(0).toUpperCase() : '')}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1 }}>
                    <h3 style={{ margin: 0, color: 'var(--ouro)', fontSize: '1.1rem', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }} onClick={() => navigate(\`/perfil/\${a.id}\`)} title={a.nome}>{a.nome}</h3>
                    <span style={{ fontSize: '0.85rem', color: 'var(--cinza)', fontWeight: '500', marginTop: 4, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }} title={a.posicao ? (a.posicao + (a.posicao_secundaria ? ' / ' + a.posicao_secundaria : '')) : 'SEM POSIÇÃO'}>{a.posicao ? (a.posicao + (a.posicao_secundaria ? ' / ' + a.posicao_secundaria : '')) : 'SEM POSIÇÃO'}</span>
                  </div>
                </div>
                
                {/* Body Row: Info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '12px 0' }}>
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--cinza)' }}>Categoria</span>
                    <strong style={{ color: '#fff', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '60%', textAlign: 'right' }}>{a.categoria || 'Sem Categoria'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '12px 0', paddingBottom: 0 }}>
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--cinza)' }}>Status Médico</span>
                    <span style={{ padding: '4px 12px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px', background: a.status_medico === 'Lesionado' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)', color: a.status_medico === 'Lesionado' ? '#ef4444' : '#22c55e', border: \`1px solid \${a.status_medico === 'Lesionado' ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)'}\` }}>
                      {a.status_medico || 'Apto'}
                    </span>
                  </div>
                </div>

                {/* Footer Row: Actions */}
                <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '15px', justifyContent: 'space-between' }}>
                    <button onClick={() => navigate('/relatorios', { state: { triggerPresencasId: a.id, triggerPresencasNome: a.nome } })} title="Histórico de Presença" className="btn" style={{ padding: '8px 12px', background: 'rgba(248, 193, 70, 0.05)', color: 'var(--ouro)', border: '1px solid rgba(248, 193, 70, 0.2)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', flex: 1, justifyContent: 'center' }}><ClipboardCheck size={16} /> <span style={{fontSize: '0.85rem', fontWeight: 'bold', whiteSpace: 'nowrap'}}>Histórico</span></button>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => toggleDM(a.id, a.status_medico)} title="Alternar DM" className="btn" style={{ padding: '8px', background: 'rgba(255,255,255,0.03)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', flexShrink: 0 }}><Activity size={16} /></button>
                        <button onClick={() => handleEdit(a)} title="Editar" className="btn" style={{ padding: '8px', background: 'rgba(59, 130, 246, 0.05)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '8px', flexShrink: 0 }}><Edit size={16} /></button>
                        <button onClick={() => handleDelete(a.id)} title="Excluir" className="btn" style={{ padding: '8px', background: 'rgba(239, 68, 68, 0.05)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px', flexShrink: 0 }}><Trash2 size={16} /></button>
                    </div>
                </div>
              </div>\n            `; // End of block

code = code.replace(originalBlock, newBlock);

fs.writeFileSync('crm/src/pages/Athletes.jsx', code, 'utf8');
console.log('Replaced successfully');

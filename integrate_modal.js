const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/Athletes.jsx', 'utf8');

// 1. Add html2pdf import if needed
if (!code.includes('html2pdf')) {
    code = code.replace("import Cropper from 'react-easy-crop';", "import Cropper from 'react-easy-crop';\nimport html2pdf from 'html2pdf.js';\nimport { Download } from 'lucide-react';");
}

// 2. Add states inside the component
let stateIdx = code.indexOf('const [form, setForm]');
if (stateIdx === -1) {
    console.log("Could not find const [form, setForm]");
    process.exit(1);
}
let nextLineIdx = code.indexOf(';', stateIdx) + 1;
const newStates = `
  const [historyModal, setHistoryModal] = useState({ show: false, loading: false, atleta: null, data: null });
  const [exportingHistory, setExportingHistory] = useState(false);
`;
code = code.substring(0, nextLineIdx) + newStates + code.substring(nextLineIdx);

// 3. Add openHistoryModal and exportHistoryPDF functions
let funcInsertionIdx = code.indexOf('// Crop States');
if (funcInsertionIdx === -1) funcInsertionIdx = code.indexOf('const handleImageUpload');
const modalFuncs = `
  const openHistoryModal = async (atleta) => {
      setHistoryModal({ show: true, loading: true, atleta: atleta, data: null });
      try {
          const res = await api.post('/api/admin/relatorios/gerador', {
              modulo: 'presencas',
              filtros: { atleta_id: atleta.id }
          });
          if (res.data.success) {
              setHistoryModal({ show: true, loading: false, atleta: atleta, data: res.data.dados });
          } else {
              alert('Erro ao carregar histórico');
              setHistoryModal({ show: false, loading: false, atleta: null, data: null });
          }
      } catch (err) {
          console.error(err);
          alert('Erro ao buscar histórico');
          setHistoryModal({ show: false, loading: false, atleta: null, data: null });
      }
  };

  const exportHistoryPDF = async () => {
      const element = document.getElementById('history-a4-preview');
      if (!element) return;
      setExportingHistory(true);
      await new Promise(resolve => setTimeout(resolve, 100)); // wait for render
      const opt = {
          margin:       [10, 10, 15, 10],
          filename:     \`Historico_Presenca_\${historyModal.atleta.nome.replace(/\\s+/g, '_')}.pdf\`,
          image:        { type: 'jpeg', quality: 1 },
          html2canvas: { scale: 2, useCORS: true, width: 794, windowWidth: 794 },
          jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
          pagebreak: { mode: ['css', 'legacy'], avoid: ['tr'] }
      };
      html2pdf().set(opt).from(element).save().then(() => {
          setExportingHistory(false);
      });
  };
`;
code = code.substring(0, funcInsertionIdx) + modalFuncs + code.substring(funcInsertionIdx);

// 4. Update the Button to use openHistoryModal
let btnRegex = /onClick=\{\(\) => navigate\('\/relatorios'[^}]+\}\}/;
code = code.replace(btnRegex, "onClick={() => openHistoryModal(a)}");

// 5. Append Modal JSX just before the final </div> of return
let endIdx = code.lastIndexOf('</div>');
// usually the second to last </div> is the container end. We can just place it before the final return closing tag
// A better way is to find a known string, like `</form>` or the final map
// Let's replace `    </div>\n  );\n}` with our modal + `    </div>\n  );\n}`

const modalJSX = `
      {/* HISTORY MODAL */}
      {historyModal.show && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 99999, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', overflowY: 'auto' }}>
              <div style={{ width: '100%', maxWidth: '850px', background: '#111', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ padding: '15px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#1a1a1a' }}>
                      <div>
                          <h2 style={{ margin: 0, color: 'var(--ouro)', fontSize: '1.2rem' }}>Histórico de Presença</h2>
                          <span style={{ color: 'var(--cinza)', fontSize: '0.85rem' }}>{historyModal.atleta?.nome}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '10px' }}>
                          {!historyModal.loading && historyModal.data && (
                              <button className="btn" onClick={exportHistoryPDF} disabled={exportingHistory} style={{ background: 'var(--ouro)', color: '#000', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
                                  {exportingHistory ? 'Gerando PDF...' : <><Download size={16} /> Baixar PDF</>}
                              </button>
                          )}
                          <button className="btn" onClick={() => setHistoryModal({ show: false, loading: false, atleta: null, data: null })} style={{ padding: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}>Fechar</button>
                      </div>
                  </div>
                  
                  <div style={{ padding: '20px', overflowX: 'auto', background: '#1a1a1a' }}>
                      {historyModal.loading ? (
                          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--ouro)' }}>Carregando histórico...</div>
                      ) : historyModal.data ? (
                          <div style={{ width: '100%', overflowX: 'auto', display: 'flex', justifyContent: 'center' }}>
                              <div id="history-a4-preview" style={{ width: '794px', minWidth: '794px', background: '#ffffff', padding: '20px 40px', boxSizing: 'border-box', color: '#111' }}>
                                  
                                  {/* A4 Header */}
                                  <div style={{ borderBottom: '3px solid #eab308', paddingBottom: '15px', marginBottom: '20px' }}>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                          <div style={{ flex: '0 0 100px' }}>
                                              <img src="/alfaacademy/admin/alfa_logo.png" alt="Logo" style={{ width: 65, objectFit: 'contain' }} />
                                          </div>
                                          <div style={{ flex: 1, textAlign: 'center' }}>
                                              <h2 style={{ margin: 0, color: '#111', fontSize: '22px', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '-0.5px' }}>
                                                  Histórico de Presenças
                                              </h2>
                                          </div>
                                          <div style={{ flex: '0 0 100px' }}></div>
                                      </div>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                          <div style={{ textAlign: 'left', color: '#555' }}>
                                              <h3 style={{ margin: '0 0 4px 0', color: '#111', fontSize: '18px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                                                  {historyModal.atleta?.nome}
                                              </h3>
                                              <p style={{ margin: 0, fontSize: '13px', fontWeight: 500, color: '#666' }}>
                                                  Categoria: {historyModal.atleta?.categoria || 'Sem Categoria'}
                                              </p>
                                          </div>
                                          <div style={{ textAlign: 'right', color: '#6c757d', fontSize: '10px', lineHeight: '1.4' }}>
                                              Gerado em:<br/>
                                              <strong style={{ color: '#333', fontSize: '11px' }}>
                                                  {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                              </strong>
                                          </div>
                                      </div>
                                  </div>

                                  {/* Summary Cards */}
                                  {(() => {
                                      const total = historyModal.data.length;
                                      const p = historyModal.data.filter(r => r.status === 'P' || r.status === 'Presente').length;
                                      const f = historyModal.data.filter(r => r.status === 'F' || r.status === 'Falta').length;
                                      const freq = total > 0 ? ((p / total) * 100).toFixed(1) : 0;
                                      return (
                                          <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
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
                                              <div style={{ flex: 1, padding: '15px', background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '8px', textAlign: 'center' }}>
                                                  <div style={{ fontSize: '11px', color: '#0369a1', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '8px' }}>Frequência</div>
                                                  <div style={{ fontSize: '24px', color: '#0f172a', fontWeight: '900' }}>{freq}%</div>
                                              </div>
                                          </div>
                                      );
                                  })()}

                                  {/* Table */}
                                  <h3 style={{ color: '#111', borderBottom: '2px solid #eee', paddingBottom: 6, marginBottom: 15, fontSize: 16, textTransform: 'uppercase', marginTop: '20px' }}>Detalhamento de Frequência</h3>
                                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', marginBottom: '30px' }}>
                                      <thead>
                                          <tr style={{ background: '#f8f9fa' }}>
                                              <th style={{ padding: '8px', borderBottom: '2px solid #dee2e6', textAlign: 'left', color: '#495057' }}>Data</th>
                                              <th style={{ padding: '8px', borderBottom: '2px solid #dee2e6', textAlign: 'center', color: '#495057' }}>Status</th>
                                              <th style={{ padding: '8px', borderBottom: '2px solid #dee2e6', textAlign: 'left', color: '#495057' }}>Justificativa</th>
                                          </tr>
                                      </thead>
                                      <tbody>
                                          {historyModal.data.map((row, idx) => {
                                              const st = row.status;
                                              const isF = st === 'F' || st === 'Falta';
                                              const stColor = isF ? '#ef4444' : '#22c55e';
                                              // Fallback date formatting
                                              let dstr = row.data_chamada;
                                              if (dstr && !dstr.includes('T')) dstr += 'T12:00:00';
                                              return (
                                                  <tr key={idx}>
                                                      <td style={{ padding: '8px', borderBottom: '1px solid #eee', color: '#111' }}>{row.data_chamada ? new Date(dstr).toLocaleDateString('pt-BR') : '-'}</td>
                                                      <td style={{ padding: '8px', borderBottom: '1px solid #eee', textAlign: 'center', fontWeight: 'bold', color: stColor }}>{st}</td>
                                                      <td style={{ padding: '8px', borderBottom: '1px solid #eee', color: '#666' }}>{row.justificativa || '-'}</td>
                                                  </tr>
                                              );
                                          })}
                                          {historyModal.data.length === 0 && (
                                              <tr><td colSpan="3" style={{ padding: '15px', textAlign: 'center', color: '#999' }}>Nenhum registro encontrado.</td></tr>
                                          )}
                                      </tbody>
                                  </table>
                                  
                                  {/* A4 Footer */}
                                  <div style={{ borderTop: '1px solid #eee', paddingTop: '10px', marginTop: '20px', textAlign: 'center', fontSize: '10px', color: '#999', paddingBottom: '20px' }}>
                                      Alfa Academy - Formando Atletas e Cidadãos.<br/>
                                      Documento de uso interno e confidencial gerado automaticamente. É vedado o compartilhamento com terceiros sem autorização prévia da coordenação esportiva.
                                  </div>
                              </div>
                          </div>
                      ) : null}
                  </div>
              </div>
          </div>
      )}
`;

// Insert before the last </div>
let insertPos = code.lastIndexOf('</div>');
code = code.substring(0, insertPos) + modalJSX + code.substring(insertPos);

fs.writeFileSync('crm/src/pages/Athletes.jsx', code, 'utf8');
console.log('Athletes.jsx modal integration complete!');

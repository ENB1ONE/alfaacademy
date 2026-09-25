const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');

const tabOld = `      <div style={{ display: 'flex', gap: 15, marginBottom: 30, borderBottom: '1px solid var(--linha)', paddingBottom: 10 }}>
        <button 
          onClick={() => setActiveTab('dashboard')} 
          style={{ background: 'transparent', border: 'none', color: activeTab === 'dashboard' ? 'var(--ouro)' : 'var(--cinza)', fontSize: 16, fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <PieIcon size={18}/> Dashboard Analítico
        </button>
        <button 
          onClick={() => setActiveTab('generator')} 
          style={{ background: 'transparent', border: 'none', color: activeTab === 'generator' ? 'var(--ouro)' : 'var(--cinza)', fontSize: 16, fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <LayoutTemplate size={18}/> Gerador A4 (BI)
        </button>
      </div>`;

const tabNew = `      <div style={{ display: 'flex', gap: 8, marginBottom: 30, background: 'rgba(255,255,255,0.03)', padding: 6, borderRadius: 12, width: 'max-content', maxWidth: '100%', overflowX: 'auto' }}>
        <button 
          onClick={() => setActiveTab('dashboard')} 
          style={{ background: activeTab === 'dashboard' ? 'var(--ouro)' : 'transparent', border: 'none', color: activeTab === 'dashboard' ? '#111' : 'var(--cinza)', fontSize: 15, fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 8, transition: 'all 0.2s' }}
        >
          <PieIcon size={18}/> Dashboard Analítico
        </button>
        <button 
          onClick={() => setActiveTab('generator')} 
          style={{ background: activeTab === 'generator' ? 'var(--ouro)' : 'transparent', border: 'none', color: activeTab === 'generator' ? '#111' : 'var(--cinza)', fontSize: 15, fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 8, transition: 'all 0.2s' }}
        >
          <LayoutTemplate size={18}/> Gerador A4 (BI)
        </button>
      </div>`;

const formOpenOld = `<div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'flex-end' }}>`;
const formOpenNew = `<div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>\n                    <div style={{ width: '100%' }}>`;

const formMidOld = `</select>
                    </div>

                    {/* Filtros Dinâmicos */}`;
const formMidNew = `</select>
                    </div>
                    {/* Filtros Dinâmicos */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, alignItems: 'end' }}>`;

const btnWrapOld = `<div style={{ flex: '1 1 150px' }}>
                        <button className="btn primary" onClick={handleGerarRelatorio} disabled={!modulo || generating} style={{ width: '100%' }}>
                            {generating ? 'Processando...' : 'Gerar Visualização'}
                        </button>
                    </div>`;
const btnWrapNew = `</div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                        <button className="btn primary" onClick={handleGerarRelatorio} disabled={!modulo || generating} style={{ padding: '12px 24px', borderRadius: '8px', minWidth: '200px', flex: window.innerWidth <= 768 ? 1 : 'none' }}>
                            {generating ? 'Processando...' : 'Gerar Visualização'}
                        </button>
                    </div>`;

const a4WrapOld = `<div id="a4-preview-wrapper" style={{ width: '100%', maxWidth: '900px', margin: '0 auto', overflowX: 'auto', background: '#1a1a1a',
                    padding: '20px',
                    borderRadius: '8px'
                }}>
                    <div id="a4-preview" className="pdf-export-container" style={{ width: '794px', minWidth: '794px', maxWidth: '794px', 
                        background: '#ffffff',
                        padding: '20px 40px',
                        boxSizing: 'border-box'
                    }}>`;
const a4WrapNew = `<div id="a4-preview-wrapper" style={{ width: '100%', overflowX: 'auto', background: '#1e1e1e', padding: '40px 20px', borderRadius: '12px', display: 'flex', justifyContent: 'center' }}>
                    <div id="a4-preview" className="pdf-export-container" style={{ width: '794px', minWidth: '794px', maxWidth: '794px', minHeight: '1123px', background: '#ffffff', padding: '40px 50px', boxSizing: 'border-box', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', borderRadius: '4px', display: 'flex', flexDirection: 'column' }}>`;

const emptyOld = `<div style={{ textAlign: 'center', color: '#999', marginTop: 100, fontStyle: 'italic' }}>
                                Configure os filtros acima e clique em "Gerar Visualização"
                            </div>`;
const emptyNew = `<div style={{ textAlign: 'center', color: '#999', margin: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: 15, minHeight: '400px' }}>
                                <FileText size={48} style={{ opacity: 0.2 }} />
                                <span style={{ fontSize: 16, maxWidth: 300 }}>Configure os filtros acima e clique em <strong>"Gerar Visualização"</strong> para montar o relatório.</span>
                            </div>`;

code = code.replace(tabOld, tabNew);
code = code.replace(formOpenOld, formOpenNew);
code = code.replace(formMidOld, formMidNew);
code = code.replace(btnWrapOld, btnWrapNew);
code = code.replace(a4WrapOld, a4WrapNew);
code = code.replace(emptyOld, emptyNew);

fs.writeFileSync('crm/src/pages/CentralRelatorios.jsx', code, 'utf8');
console.log("Done carefully.");

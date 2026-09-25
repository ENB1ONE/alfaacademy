const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');

// 1. Fix the Tabs
const oldTabs = `      <div style={{ display: 'flex', gap: 15, marginBottom: 30, borderBottom: '1px solid var(--linha)', paddingBottom: 10 }}>
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

const newTabs = `      <div style={{ display: 'flex', gap: 8, marginBottom: 30, background: 'rgba(255,255,255,0.03)', padding: 6, borderRadius: 12, width: 'max-content', maxWidth: '100%', overflowX: 'auto' }}>
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

code = code.replace(oldTabs, newTabs);

// 2. Fix the Construtor Visual form
const oldFormStart = `<div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'flex-end' }}>`;
const newFormStart = `<div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div style={{ width: '100%' }}>`;

code = code.replace(oldFormStart, newFormStart);

const oldModuloEnd = `</select>
                    </div>`;
const newModuloEnd = `</select>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, alignItems: 'end' }}>`;

code = code.replace(oldModuloEnd, newModuloEnd);

const oldButtonDiv = `<div style={{ flex: '1 1 200px', display: 'flex' }}>
                        <button className="btn" onClick={fetchGeneratorData} disabled={loadingData}`;
const newButtonDiv = `</div>
                    
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                        <button className="btn" onClick={fetchGeneratorData} disabled={loadingData}`;

code = code.replace(oldButtonDiv, newButtonDiv);

// 3. Fix the Button styling to be consistent and not massive
const oldButtonInner = `style={{ width: '100%', background: 'var(--ouro)', color: '#000', fontWeight: 'bold' }}`;
const newButtonInner = `style={{ padding: '12px 24px', background: 'var(--ouro)', color: '#111', fontWeight: 'bold', borderRadius: '8px', minWidth: '200px', flex: window.innerWidth <= 768 ? 1 : 'none' }}`;
code = code.replace(oldButtonInner, newButtonInner);

// 4. Fix the A4 Wrapper styling
const oldWrapper = `<div id="a4-preview-wrapper" style={{ width: '100%', maxWidth: '900px', margin: '0 auto', overflowX: 'auto', background: '#1a1a1a',
                    padding: '20px',
                    borderRadius: '8px'
                }}>
                    <div id="a4-preview" className="pdf-export-container" style={{ width: '794px', minWidth: '794px', maxWidth: '794px', 
                        background: '#ffffff',
                        padding: '20px 40px',
                        boxSizing: 'border-box'
                    }}>`;
                    
const newWrapper = `<div id="a4-preview-wrapper" style={{ width: '100%', overflowX: 'auto', background: '#1e1e1e',
                    padding: '40px 20px',
                    borderRadius: '12px',
                    display: 'flex',
                    justifyContent: 'center'
                }}>
                    <div id="a4-preview" className="pdf-export-container" style={{ width: '794px', minWidth: '794px', maxWidth: '794px', minHeight: '1123px',
                        background: '#ffffff',
                        padding: '40px 50px',
                        boxSizing: 'border-box',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                        borderRadius: '4px',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>`;

code = code.replace(oldWrapper, newWrapper);

// 5. Fix Empty State appearance
const oldEmpty = `<div style={{ textAlign: 'center', color: '#999', marginTop: 100, fontStyle: 'italic' }}>
                                Configure os filtros acima e clique em "Gerar Visualização"
                            </div>`;
const newEmpty = `<div style={{ textAlign: 'center', color: '#999', margin: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: 15 }}>
                                <FileText size={48} style={{ opacity: 0.2 }} />
                                <span style={{ fontSize: 16, maxWidth: 300 }}>Configure os filtros acima e clique em <strong>"Gerar Visualização"</strong> para montar o relatório.</span>
                            </div>`;
                            
code = code.replace(oldEmpty, newEmpty);

fs.writeFileSync('crm/src/pages/CentralRelatorios.jsx', code, 'utf8');
console.log("Replacements attempted.");

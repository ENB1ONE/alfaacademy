const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');

// 1. Tabs
const tabStr = `<div style={{ display: 'flex', gap: 15, marginBottom: 30, borderBottom: '1px solid var(--linha)', paddingBottom: 10 }}>`;
const tabEndStr = `</button>\n      </div>`;
let t1 = code.indexOf(tabStr);
let t2 = code.indexOf(tabEndStr, t1) + tabEndStr.length;
if(t1 !== -1 && t2 !== -1) {
    code = code.substring(0, t1) + `<div style={{ display: 'flex', gap: 8, marginBottom: 30, background: 'rgba(255,255,255,0.03)', padding: 6, borderRadius: 12, width: 'max-content', maxWidth: '100%', overflowX: 'auto' }}>
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
      </div>` + code.substring(t2);
}

// 2. Form Layout & Grid
const formOpenStr = `<div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'flex-end' }}>`;
code = code.replace(formOpenStr, `<div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>\n                    <div style={{ width: '100%' }}>`);

const filterStartStr = `{/* Filtros Dinâmicos */}`;
code = code.replace(filterStartStr, `</div>\n                    {/* Filtros Dinâmicos */}\n                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, alignItems: 'end' }}>`);

const btnWrapperStr = `<div style={{ flex: '1 1 150px' }}>`;
code = code.replace(btnWrapperStr, `</div>\n                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>`);

const btnStyleStr = `style={{ width: '100%' }}>\n                            {generating ? 'Processando...' : 'Gerar Visualização'}`;
code = code.replace(btnStyleStr, `style={{ padding: '12px 24px', borderRadius: '8px', minWidth: '200px', flex: window.innerWidth <= 768 ? 1 : 'none' }}>\n                            {generating ? 'Processando...' : 'Gerar Visualização'}`);

// 3. A4 Wrapper
const a4WrapStr = `<div id="a4-preview-wrapper" style={{ width: '100%', maxWidth: '900px', margin: '0 auto', overflowX: 'auto', background: '#1a1a1a',`;
const a4WrapEnd = `border-box'\n                    }}>`;
let w1 = code.indexOf(a4WrapStr);
let w2 = code.indexOf(a4WrapEnd, w1) + a4WrapEnd.length;
if (w1 !== -1 && w2 !== -1) {
    code = code.substring(0, w1) + `<div id="a4-preview-wrapper" style={{ width: '100%', overflowX: 'auto', background: '#1e1e1e', padding: '40px 20px', borderRadius: '12px', display: 'flex', justifyContent: 'center' }}>
                    <div id="a4-preview" className="pdf-export-container" style={{ width: '794px', minWidth: '794px', maxWidth: '794px', minHeight: '1123px', background: '#ffffff', padding: '40px 50px', boxSizing: 'border-box', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', borderRadius: '4px', display: 'flex', flexDirection: 'column' }}>` + code.substring(w2);
}

// 4. Empty State
const emptyStr = `<div style={{ textAlign: 'center', color: '#999', marginTop: 100, fontStyle: 'italic' }}>\n                                Configure os filtros acima e clique em "Gerar Visualização"\n                            </div>`;
code = code.replace(emptyStr, `<div style={{ textAlign: 'center', color: '#999', margin: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: 15, minHeight: '400px' }}>\n                                <FileText size={48} style={{ opacity: 0.2 }} />\n                                <span style={{ fontSize: 16, maxWidth: 300 }}>Configure os filtros acima e clique em <strong>"Gerar Visualização"</strong> para montar o relatório.</span>\n                            </div>`);

fs.writeFileSync('crm/src/pages/CentralRelatorios.jsx', code, 'utf8');
console.log("Done.");

const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');

// 1. Tabs
code = code.replace(
    /<div style=\{\{\s*display:\s*'flex',\s*gap:\s*15,\s*marginBottom:\s*30,\s*borderBottom:\s*'1px solid var\(--linha\)',\s*paddingBottom:\s*10\s*\}\}>([\s\S]*?)<\/div>/,
    `<div style={{ display: 'flex', gap: 8, marginBottom: 30, background: 'rgba(255,255,255,0.03)', padding: 6, borderRadius: 12, width: 'max-content', maxWidth: '100%', overflowX: 'auto' }}>
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
      </div>`
);

// 2. Form layout
// Start of form
code = code.replace(
    /<div style=\{\{\s*display:\s*'flex',\s*flexWrap:\s*'wrap',\s*gap:\s*20,\s*alignItems:\s*'flex-end'\s*\}\}>/,
    `<div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div style={{ width: '100%' }}>`
);

// Open grid for dynamic filters
code = code.replace(
    /<\/select>\s*<\/div>\s*\{\/\* Filtros Dinâmicos \*\/\}/,
    `</select>
                    </div>
                    {/* Filtros Dinâmicos */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, alignItems: 'end' }}>`
);

// Close the grid right before the button wrapper
code = code.replace(
    /<div style=\{\{\s*flex:\s*'1 1 150px'\s*\}\}>\s*<button className="btn primary" onClick=\{handleGerarRelatorio\}/,
    `</div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                        <button className="btn primary" onClick={handleGerarRelatorio}`
);

// Replace button inline styles
code = code.replace(
    /style=\{\{\s*width:\s*'100%'\s*\}\}>\s*\{\s*generating\s*\?\s*'Processando\.\.\.'\s*:\s*'Gerar Visualização'\s*\}/,
    `style={{ padding: '12px 24px', borderRadius: '8px', minWidth: '200px', flex: window.innerWidth <= 768 ? 1 : 'none' }}>
                            {generating ? 'Processando...' : 'Gerar Visualização'}`
);

// 3. A4 Wrapper
code = code.replace(
    /style=\{\{\s*width:\s*'100%',\s*maxWidth:\s*'900px',\s*margin:\s*'0 auto',\s*overflowX:\s*'auto',\s*background:\s*'#1a1a1a',\s*padding:\s*'20px',\s*borderRadius:\s*'8px'\s*\}\}/,
    `style={{ width: '100%', overflowX: 'auto', background: '#1e1e1e', padding: '40px 20px', borderRadius: '12px', display: 'flex', justifyContent: 'center' }}`
);

code = code.replace(
    /style=\{\{\s*width:\s*'794px',\s*minWidth:\s*'794px',\s*maxWidth:\s*'794px',\s*background:\s*'#ffffff',\s*padding:\s*'20px 40px',\s*boxSizing:\s*'border-box'\s*\}\}/,
    `style={{ width: '794px', minWidth: '794px', maxWidth: '794px', minHeight: '1123px', background: '#ffffff', padding: '40px 50px', boxSizing: 'border-box', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', borderRadius: '4px', display: 'flex', flexDirection: 'column' }}`
);

// 4. Empty state
code = code.replace(
    /<div style=\{\{\s*textAlign:\s*'center',\s*color:\s*'#999',\s*marginTop:\s*100,\s*fontStyle:\s*'italic'\s*\}\}>\s*Configure os filtros acima e clique em "Gerar Visualização"\s*<\/div>/,
    `<div style={{ textAlign: 'center', color: '#999', margin: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: 15, minHeight: '400px' }}>
                                <FileText size={48} style={{ opacity: 0.2 }} />
                                <span style={{ fontSize: 16, maxWidth: 300 }}>Configure os filtros acima e clique em <strong>"Gerar Visualização"</strong> para montar o relatório.</span>
                            </div>`
);

fs.writeFileSync('crm/src/pages/CentralRelatorios.jsx', code, 'utf8');
console.log("Regex replacements finished.");

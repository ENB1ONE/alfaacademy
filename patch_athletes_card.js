const fs = require('fs');
let ath = fs.readFileSync('crm/src/pages/Athletes.jsx', 'utf8');

const targetStr = "<div>\n                  <h3 style={{ margin: 0, color: 'var(--ouro)', fontSize: '1.2rem' }}>{a.nome}</h3>";

const startIndex = ath.indexOf(targetStr);
if (startIndex !== -1) {
    const endIndex = ath.indexOf("</div>", startIndex) + 6;
    
    // Extracted exactly what was there, just replace it!
    const original = ath.substring(startIndex, endIndex);
    const newTitle = `<div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--ouro)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 18, flexShrink: 0, overflow: 'hidden' }}>
                    {a.foto ? <img src={a.foto} alt={a.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (a.nome ? a.nome.charAt(0) : '')}
                  </div>
                  ` + original + `
                </div>`;
                
    ath = ath.replace(original, newTitle);
    fs.writeFileSync('crm/src/pages/Athletes.jsx', ath, 'utf8');
}

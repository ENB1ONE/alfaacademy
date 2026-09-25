const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/Athletes.jsx', 'utf8');

let startStr = '<div id="history-a4-preview"';
let startIdx = code.indexOf(startStr);
let docStr = 'Documento de uso interno e confidencial gerado automaticamente.';
let docIdx = code.indexOf(docStr, startIdx);

let firstDivEnd = code.indexOf('</div>', docIdx);
// firstDivEnd is the end of the footer div.
let secondDivEnd = code.indexOf('</div>', firstDivEnd + 6);
// secondDivEnd is the end of history-a4-preview.

if (startIdx !== -1 && secondDivEnd !== -1) {
    let originalBlock = code.substring(startIdx, secondDivEnd + 6);
    let innerStart = originalBlock.indexOf('>') + 1;
    let innerContent = originalBlock.substring(innerStart, originalBlock.length - 6);
    
    let style = `<style>{\`
  .history-responsive-view { width: 100%; background: #ffffff; padding: 15px; box-sizing: border-box; color: #111; }
  .history-responsive-view .h-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
  .history-responsive-view .h-meta { display: flex; justify-content: space-between; align-items: flex-end; }
  .history-responsive-view .h-cards { display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; }
  .history-responsive-view .h-card { flex: 1 1 calc(50% - 10px); min-width: 130px; padding: 15px; background: #f8f9fa; border: 1px solid #eaeaea; border-radius: 8px; text-align: center; }
  @media (max-width: 600px) {
      .history-responsive-view .h-row { flex-direction: column !important; text-align: center; gap: 10px; }
      .history-responsive-view .h-row > div { flex: none !important; }
      .history-responsive-view .h-meta { flex-direction: column !important; align-items: center !important; text-align: center !important; gap: 10px; }
      .history-responsive-view .h-meta > div { text-align: center !important; }
  }
\`}</style>
<>
<div className="history-responsive-view">
`;
    let respInner = innerContent
        .replace(/<div style=\{\{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' \}\}>/g, '<div className="h-row">')
        .replace(/<div style=\{\{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' \}\}>/g, '<div className="h-meta">')
        .replace(/<div style=\{\{ display: 'flex', gap: '15px', marginBottom: '20px' \}\}>/g, '<div className="h-cards">')
        .replace(/<div style=\{\{ flex: 1, padding: '15px', background: '#f8f9fa', border: '1px solid #eaeaea', borderRadius: '8px', textAlign: 'center' \}\}>/g, '<div className="h-card" style={{background:"#f8f9fa", borderColor:"#eaeaea"}}>')
        .replace(/<div style=\{\{ flex: 1, padding: '15px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', textAlign: 'center' \}\}>/g, '<div className="h-card" style={{background:"#f0fdf4", borderColor:"#bbf7d0"}}>')
        .replace(/<div style=\{\{ flex: 1, padding: '15px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', textAlign: 'center' \}\}>/g, '<div className="h-card" style={{background:"#fef2f2", borderColor:"#fecaca"}}>')
        .replace(/<div style=\{\{ flex: 1, padding: '15px', background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '8px', textAlign: 'center' \}\}>/g, '<div className="h-card" style={{background:"#f0f9ff", borderColor:"#bae6fd"}}>');

    let replacement = style + respInner + `</div>\n<div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>\n<div id="history-a4-preview" style={{ width: '794px', minWidth: '794px', background: '#ffffff', padding: '20px 40px', boxSizing: 'border-box', color: '#111' }}>\n` + innerContent + `</div>\n</div>\n</>`;

    code = code.substring(0, startIdx) + replacement + code.substring(secondDivEnd + 6);
    fs.writeFileSync('crm/src/pages/Athletes.jsx', code, 'utf8');
    console.log("Done correctly!");
}

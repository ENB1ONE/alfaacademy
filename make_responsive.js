const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/Athletes.jsx', 'utf8');

const startStr = '<div id="history-a4-preview"';
const startIdx = code.indexOf(startStr);

if (startIdx === -1) {
    console.log("Could not find start");
    process.exit(1);
}

let stack = 0;
let endIdx = -1;
let i = startIdx;
while (i < code.length) {
    if (code.substring(i, i + 4) === '<div') {
        stack++;
        i += 4;
    } else if (code.substring(i, i + 5) === '</div') {
        stack--;
        if (stack === 0) {
            endIdx = i + 5;
            break;
        }
        i += 5;
    } else {
        i++;
    }
}

if (endIdx === -1) {
    console.log("Could not find end");
    process.exit(1);
}

let block = code.substring(startIdx, endIdx);

// Now, we will create two versions of this block:
// 1. Visible Mobile-Responsive Block
let responsiveBlock = block
    .replace('id="history-a4-preview"', 'className="history-responsive-view"')
    .replace("width: '794px', minWidth: '794px'", "width: '100%'")
    .replace("padding: '20px 40px'", "padding: '15px'")
    .replace("<div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>", "<div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>")
    .replace(/<div style=\{\{ flex: 1, padding: '15px'/g, "<div style={{ flex: '1 1 calc(50% - 10px)', minWidth: '130px', padding: '15px'");

// 2. Hidden PDF Block
let pdfBlock = `<div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>\n${block}\n</div>`;

// Combine them
let replacement = `
<style>{\`
  .history-responsive-view .history-header { flex-direction: row; }
  @media (max-width: 600px) {
      .history-responsive-view .history-header { flex-direction: column !important; text-align: center; gap: 10px; }
      .history-responsive-view .history-header > div { flex: none !important; }
      .history-responsive-view .history-meta { flex-direction: column !important; align-items: center !important; text-align: center !important; gap: 10px; }
      .history-responsive-view .history-meta > div { text-align: center !important; }
  }
\`}</style>
${responsiveBlock}
${pdfBlock}
`;

// Add classes to responsive block to apply the style
replacement = replacement.replace(
    "<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>",
    "<div className=\"history-header\" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>"
);
replacement = replacement.replace(
    "<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>",
    "<div className=\"history-meta\" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>"
);

code = code.substring(0, startIdx) + replacement + code.substring(endIdx);
fs.writeFileSync('crm/src/pages/Athletes.jsx', code, 'utf8');
console.log("Successfully duplicated block for responsive and PDF views!");

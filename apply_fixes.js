const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');

// 1. Fix the export function options for page breaks and correct scaling
const oldExport = `const opt = {
      margin:       10,
      filename:     \`Dashboard_Executivo_\${new Date().getTime()}.pdf\`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    html2pdf().from(element).set(opt).save().then(() => { });`;

const newExport = `const opt = {
      margin:       [10, 10, 15, 10], // top, left, bottom, right
      filename:     \`Dashboard_Executivo_\${new Date().getTime()}.pdf\`,
      image:        { type: 'jpeg', quality: 1 },
      html2canvas:  { scale: 2, useCORS: true, windowWidth: 900 },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak:    { mode: ['css', 'legacy'] }
    };
    
    html2pdf().from(element).set(opt).save();`;

if (code.includes('const opt = {')) {
    code = code.replace(oldExport, newExport);
}

// 2. Fix the wrapper and CSS of the hidden div
// The old wrapper was: <div style={{ position: 'absolute', top: '-9999px', left: '-9999px', zIndex: -100 }}>
// The new wrapper should have fixed width and opacity instead of negative positions that might clip.
const oldWrapper = `<div style={{ position: 'absolute', top: '-9999px', left: '-9999px', zIndex: -100 }}>
          <div id="dashboard-a4-preview" style={{
              width: '794px',
              minHeight: '1123px',
              background: '#ffffff',
              padding: '40px',
              boxSizing: 'border-box'
          }}>`;

const newWrapper = `<div style={{ position: 'fixed', top: 0, left: 0, width: '900px', zIndex: -9999, opacity: 0.001, pointerEvents: 'none' }}>
          <div id="dashboard-a4-preview" style={{
              width: '100%',
              minHeight: '1123px',
              background: '#ffffff',
              padding: '40px',
              boxSizing: 'border-box'
          }}>`;

if (code.includes(`width: '794px'`)) {
    code = code.replace(oldWrapper, newWrapper);
}

// 3. Inject CSS for page breaks and fix th styles
const oldCSS = `                  .empty-cell {
                      color: #999 !important;
                      font-style: italic;
                  }`;

const newCSS = `                  .empty-cell {
                      color: #999 !important;
                      font-style: italic;
                  }
                  /* Fix Page Breaks for PDF */
                  #dashboard-a4-preview tr { page-break-inside: avoid; page-break-after: auto; }
                  #dashboard-a4-preview thead { display: table-header-group; }
                  #dashboard-a4-preview tfoot { display: table-row-group; }
                  .avoid-break { page-break-inside: avoid; }
                  /* Ensure headers wrap normally */
                  #dashboard-a4-preview th { white-space: normal; word-wrap: break-word; overflow: visible; }`;

code = code.replace(oldCSS, newCSS);

// 4. Remove text-cell class from TH elements to stop ellipsis cutting off "TIPO LESÃO" etc
code = code.replace(/<th className="text-cell"/g, '<th className=""');
code = code.replace(/<th className="num-cell"/g, '<th className="" style={{ textAlign: "center", ');

// 5. Fix the date header minWidth
code = code.replace(/<div style=\{\{ textAlign: 'right', color: '#6c757d', fontSize: '11px', lineHeight: '1\.5', paddingTop: '5px' \}\}>/g, 
  `<div style={{ textAlign: 'right', color: '#6c757d', fontSize: '11px', lineHeight: '1.5', paddingTop: '5px', minWidth: '150px' }}>`);

fs.writeFileSync('crm/src/pages/CentralRelatorios.jsx', code, 'utf8');
console.log('Adjustments applied successfully.');

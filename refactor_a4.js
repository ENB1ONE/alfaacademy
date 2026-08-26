const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');

// 1. Revert container widths from 1024px to A4 dimensions (794px)
code = code.replace(/width: '1024px', minWidth: '1024px', maxWidth: '1024px'/g, "width: '100%', minWidth: '794px', maxWidth: '794px'");
code = code.replace(/width: '1024px', zIndex: -9999/g, "width: '794px', zIndex: -9999");

// 2. Fix the html2canvas configuration (change windowWidth to 794)
code = code.replace(/windowWidth: 1200/g, 'windowWidth: 794');
code = code.replace(/windowWidth: \d+/g, 'windowWidth: 794');

// 3. Inject new robust CSS for table, th, td
const oldCssRegex = /#dashboard-a4-preview th, #a4-preview th \{[\s\S]*?\}/;
const newCss = `#dashboard-a4-preview table, #a4-preview table {
                      table-layout: fixed !important;
                      width: 100% !important;
                  }
                  #dashboard-a4-preview th, #a4-preview th {
                      background-color: #111111 !important;
                      color: #eab308 !important;
                      padding: 6px 4px !important;
                      font-size: 9px !important;
                      font-weight: bold !important;
                      text-transform: uppercase !important;
                      border: 1px solid #000 !important;
                      white-space: normal !important;
                      word-wrap: break-word !important;
                  }
                  #dashboard-a4-preview td, #a4-preview td {
                      font-size: 10px !important;
                      word-wrap: break-word !important;
                  }`;
if (oldCssRegex.test(code)) {
    code = code.replace(oldCssRegex, newCss);
}

// 4. Ensure headers and text sizes don't force overflow (in case there's inline nowrap)
code = code.replace(/whiteSpace: 'nowrap'/g, "whiteSpace: 'normal'");
// except for the flex wrapper of the dates? The date wrapper can wrap if it needs to, or stay normal.
// Let's explicitly fix the date wrapper:
code = code.replace(/flex: '0 0 220px', minWidth: '220px', textAlign: 'right', color: '#6c757d', fontSize: '11px', lineHeight: '1\.5', paddingTop: '5px', whiteSpace: 'normal'/g, 
                    "flex: '0 0 180px', minWidth: '180px', textAlign: 'right', color: '#6c757d', fontSize: '10px', lineHeight: '1.4', paddingTop: '5px'");

fs.writeFileSync('crm/src/pages/CentralRelatorios.jsx', code, 'utf8');
console.log('CSS and Layout fixed for A4 794px strict limits.');

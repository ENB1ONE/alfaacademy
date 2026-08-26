const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');

const oldFooterRegex = /<div style=\{\{\s*marginTop:\s*'20px',\s*paddingTop:\s*'15px',\s*borderTop:\s*'1px solid #ddd',\s*textAlign:\s*'center',\s*color:\s*'#888',\s*fontSize:\s*'10px',\s*textTransform:\s*'uppercase',\s*letterSpacing:\s*'0\.5px'\s*\}\}>\s*Documento Confidencial • Gerado automaticamente via Alfa Academy BI\s*<\/div>/g;

const newFooter = `<div style={{ width: '100%', marginTop: '20px', paddingTop: '10px', borderTop: '1px solid #EAEAEA', textAlign: 'center', color: '#6C757D', fontSize: '10px' }}>
                  <strong style={{ fontWeight: 'bold' }}>Alfa Academy – Formando Atletas e Cidadãos.</strong><br/>
                  Documento de uso interno e confidencial gerado automaticamente. É vedado o compartilhamento com terceiros sem autorização prévia da coordenação esportiva.
              </div>`;

code = code.replace(oldFooterRegex, newFooter);

fs.writeFileSync('crm/src/pages/CentralRelatorios.jsx', code, 'utf8');
console.log('Footers updated successfully.');

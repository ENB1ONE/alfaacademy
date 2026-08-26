const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');

const regex = /<div[^>]*>\s*Documento Confidencial • Gerado automaticamente via Alfa Academy BI\s*<\/div>/g;

const newFooter = `<div style={{ width: '100%', marginTop: '20px', paddingTop: '10px', borderTop: '1px solid #EAEAEA', textAlign: 'center', color: '#6C757D', fontSize: '10px' }}>
                  <strong style={{ fontWeight: 'bold' }}>Alfa Academy – Formando Atletas e Cidadãos.</strong><br/>
                  Documento de uso interno e confidencial gerado automaticamente. É vedado o compartilhamento com terceiros sem autorização prévia da coordenação esportiva.
              </div>`;

if(regex.test(code)) {
    code = code.replace(regex, newFooter);
    fs.writeFileSync('crm/src/pages/CentralRelatorios.jsx', code, 'utf8');
    console.log('Replaced via permissive regex.');
} else {
    console.log('Still not found.');
}

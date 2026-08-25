const fs = require('fs');
let code = fs.readFileSync('crm/index.html', 'utf8');

if (!code.includes('serviceWorker')) {
    const swScript = `
    <script>
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('/alfaacademy/admin/sw.js').then(reg => {
            console.log('SW registered: ', reg.scope);
          }).catch(err => {
            console.log('SW registration failed: ', err);
          });
        });
      }
    </script>
  </body>`;
    
    code = code.replace(/<\/body>/, swScript);
    fs.writeFileSync('crm/index.html', code, 'utf8');
}
console.log('index.html updated with SW registration');

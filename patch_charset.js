const fs = require('fs');
let html = fs.readFileSync('crm/index.html', 'utf8');

if (!html.includes('<meta charset="UTF-8"')) {
    html = html.replace('<head>', '<head>\n    <meta charset="UTF-8" />');
    fs.writeFileSync('crm/index.html', html, 'utf8');
    console.log('Added UTF-8 charset to index.html');
} else {
    console.log('UTF-8 charset already exists in index.html');
}

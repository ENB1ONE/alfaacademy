const fs = require('fs');
const path = require('path');

const dir = 'crm/src/pages';
const files = fs.readdirSync(dir);

files.forEach(file => {
  if (file.endsWith('.jsx')) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Convert to buffer to debug
    const buf = Buffer.from(content, 'utf8');
    
    // We will replace using string literal hex if needed, but standard replace with regex hex:
    content = content.replace(/\x50\x6F\x73\x69\xC3\x83\xC2\xA7\xC3\x83\xC2\xA3\x6F/g, 'Posição');
    content = content.replace(/\x70\x6F\x73\x69\xC3\x83\xC2\xA7\xC3\x83\xC2\xA3\x6F/g, 'posição');
    
    fs.writeFileSync(filePath, content, 'utf8');
  }
});
console.log('Done');

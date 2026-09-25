const fs = require('fs');
const files = fs.readdirSync('backend').filter(f => f.endsWith('.js') || f.endsWith('.sql'));
console.log(files);

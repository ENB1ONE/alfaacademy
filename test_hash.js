const bcrypt = require('bcryptjs');
const hash = bcrypt.hashSync('alfa@2026', 10);
console.log(hash);

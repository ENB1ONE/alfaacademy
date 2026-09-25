const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');

let start = code.indexOf("{/* Filtros Dinâmicos */}");
let end = code.indexOf("</form>"); // End of the form containing the filters
console.log(code.substring(start, end));

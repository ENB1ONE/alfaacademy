const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');

code = code.replace(
    `</select>\n                    </div>\n                    {/* Filtros Dinâmicos */}`,
    `</select>\n                    </div>\n                    </div>\n                    {/* Filtros Dinâmicos */}`
);

fs.writeFileSync('crm/src/pages/CentralRelatorios.jsx', code, 'utf8');

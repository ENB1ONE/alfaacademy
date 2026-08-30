const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');

// Replace the generic displayVal logic to handle objects
const target = `if (typeof val === 'string' && val.match(/^\\d{4}-\\d{2}-\\d{2}T/)) {
                                                    displayVal = new Date(val).toLocaleDateString('pt-BR');
                                                }
                                                displayVal = (displayVal && displayVal.toString().trim() !== '') ? displayVal : '-';`;

const replacement = `if (typeof val === 'string' && val.match(/^\\d{4}-\\d{2}-\\d{2}T/)) {
                                                    displayVal = new Date(val).toLocaleDateString('pt-BR');
                                                } else if (typeof val === 'object' && val !== null) {
                                                    // Evita o React Error #31 ao tentar renderizar objetos/arrays
                                                    displayVal = Array.isArray(val) ? \`\${val.length} item(s)\` : JSON.stringify(val);
                                                }
                                                
                                                displayVal = (displayVal !== null && displayVal !== undefined && displayVal.toString().trim() !== '') ? displayVal : '-';`;

code = code.replace(target, replacement);

fs.writeFileSync('crm/src/pages/CentralRelatorios.jsx', code, 'utf8');
console.log('Fixed object rendering in generic tables.');

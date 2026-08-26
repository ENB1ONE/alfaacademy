const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');

let endIdx = code.indexOf('{/* A4 Body (Table) */}');

let tableStart = code.indexOf('<table>', endIdx);
let tableEnd = code.indexOf('</table>', tableStart) + 8;

const newTableHead = `
                        {(() => {
                            let columns = Object.keys(reportData[0] || {});
                            if (modulo === 'presencas' && filtros.atleta_id) {
                                columns = columns.filter(c => c !== 'nome' && c !== 'categoria');
                            }
                            return (
                                <table>
                                    <thead>
                                        <tr>
                                            {columns.map((col, i) => (
                                                <th key={i} style={{ width: columns.length === 2 ? '50%' : 'auto' }}>{col.replace(/_/g, ' ')}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reportData.map((row, idx) => (
                                            <tr key={idx}>
                                                {columns.map((key, i) => {
                                                    const val = row[key];
                                                    let displayVal = val;
                                                    
                                                    if (key === 'status') {
                                                        if (val === 'P') displayVal = 'Presente';
                                                        else if (val === 'F') displayVal = 'Falta';
                                                    }

                                                    if (typeof val === 'string' && val.match(/^\\d{4}-\\d{2}-\\d{2}T/)) {
                                                        displayVal = new Date(val).toLocaleDateString('pt-BR');
                                                    }
                                                    displayVal = (displayVal && displayVal.toString().trim() !== '') ? displayVal : '-';
                                                    const emptyClass = displayVal === '-' ? 'empty-cell' : '';
                                                    
                                                    const isNumOrDate = !isNaN(displayVal) || (typeof displayVal === 'string' && displayVal.includes('/'));
                                                    
                                                    return (
                                                        <td key={i} className={emptyClass} style={{ textAlign: isNumOrDate ? 'center' : 'left' }}>
                                                            {displayVal}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            );
                        })()}`;

if (tableStart !== -1 && tableEnd !== -1) {
    code = code.substring(0, tableStart) + newTableHead + code.substring(tableEnd);
    console.log("Table replaced successfully");
} else {
    console.log("Failed to find table boundaries.");
}

fs.writeFileSync('crm/src/pages/CentralRelatorios.jsx', code, 'utf8');

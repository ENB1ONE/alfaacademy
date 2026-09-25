const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/Athletes.jsx', 'utf8');

const regex = /<button onClick=\{\(\) => toggleDM\(a\.id, a\.status_medico\)\} title="Alternar DM"/;
const replacement = `
                    <button onClick={() => navigate('/relatorios', { state: { triggerPresencasId: a.id, triggerPresencasNome: a.nome } })} title="Histórico de Presença" className="btn" style={{ padding: '8px', background: 'rgba(248, 193, 70, 0.05)', color: 'var(--ouro)', border: '1px solid rgba(248, 193, 70, 0.2)', borderRadius: '8px' }}><ClipboardCheck size={16} /></button>
                    <button onClick={() => toggleDM(a.id, a.status_medico)} title="Alternar DM"`;

if (code.match(regex)) {
    code = code.replace(regex, replacement);
    // Also we need to ensure ClipboardCheck is imported.
    if (!code.includes('ClipboardCheck')) {
        code = code.replace("import { Activity,", "import { Activity, ClipboardCheck,");
        // If Activity isn't there, just replace 'lucide-react'
        if (code.indexOf("ClipboardCheck") === -1) {
             code = code.replace(/import \{([^}]+)\} from 'lucide-react';/, "import { $1, ClipboardCheck } from 'lucide-react';");
        }
    }
    fs.writeFileSync('crm/src/pages/Athletes.jsx', code, 'utf8');
    console.log("Athletes.jsx patched successfully!");
} else {
    console.log("Could not find toggleDM button");
}

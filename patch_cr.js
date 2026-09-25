const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');

// We need useLocation. It might already be imported or not. Let's check imports.
if (!code.includes('useLocation')) {
    code = code.replace(/import \{([^}]+)\} from 'react-router-dom';/g, "import { $1, useLocation } from 'react-router-dom';");
    if (!code.includes('useLocation')) {
        code = "import { useLocation } from 'react-router-dom';\n" + code;
    }
}

// Add const location = useLocation(); inside CentralRelatorios
const componentStart = code.indexOf('export default function CentralRelatorios() {');
const addLocation = code.replace('export default function CentralRelatorios() {', "export default function CentralRelatorios() {\n  const location = useLocation();");

// Add the logic inside useEffect
const useEffectStart = addLocation.indexOf('useEffect(() => {');
const insideUseEffect = `useEffect(() => {
    const triggerState = location.state;
    if (triggerState && triggerState.triggerPresencasId) {
        setActiveTab('generator');
        setModulo('presencas');
        setFiltros({
           nome_atleta: triggerState.triggerPresencasNome,
           atleta_id: triggerState.triggerPresencasId
        });
        
        api.post('/api/admin/relatorios/gerador', { 
           modulo: 'presencas', 
           filtros: { nome_atleta: triggerState.triggerPresencasNome, atleta_id: triggerState.triggerPresencasId } 
        }).then(res => {
            if (res.data.success) {
                setReportData(res.data.dados);
            }
        }).catch(err => console.error(err));
        
        // Clear state
        window.history.replaceState({}, document.title);
    }`;

code = addLocation.replace('useEffect(() => {', insideUseEffect);

fs.writeFileSync('crm/src/pages/CentralRelatorios.jsx', code, 'utf8');
console.log("CentralRelatorios.jsx patched successfully!");

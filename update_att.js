const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/Attendance.jsx', 'utf8');

const btnOld = `{atletas.length > 0 && (
          <button onClick={handleSave} className="btn" style={{ width: '100%', marginTop: 20, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
            <Save size={20} /> Salvar Chamada
          </button>
        )}`;
        
const btnNew = `{atletas.length > 0 && (
          <div className="sticky-bottom-action">
              <button onClick={handleSave} className="btn primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, fontSize: '16px', padding: '14px' }}>
                <Save size={20} /> Salvar Chamada
              </button>
          </div>
        )}`;

if (code.includes('Salvar Chamada')) {
    code = code.replace(btnOld, btnNew);
    
    // Also let's update the "Carregando..."
    const loadingOld = `{loading ? <div style={{ color: 'var(--cinza)' }}>Carregando...</div> : (`;
    const loadingNew = `{loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 15, marginTop: 20 }}>
              {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="skeleton" style={{ height: 60, width: '100%' }}></div>
              ))}
          </div>
        ) : (`;
    code = code.replace(loadingOld, loadingNew);
    
    fs.writeFileSync('crm/src/pages/Attendance.jsx', code, 'utf8');
    console.log("Attendance updated.");
} else {
    console.log("Could not find targets.");
}

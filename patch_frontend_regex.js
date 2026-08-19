const fs = require('fs');

let ov = fs.readFileSync('crm/src/pages/Overview.jsx', 'utf8');
ov = ov.replace(
    /<div style=\{\{ width: 32, height: 32, borderRadius: '50%', background: 'var\(--ouro\)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 \}\}>\s*\{a\.nome\.charAt\(0\)\}\s*<\/div>/g,
    `<div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--ouro)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0, overflow: 'hidden' }}>
        {a.foto ? <img src={a.foto} alt={a.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : a.nome.charAt(0)}
    </div>`
);
fs.writeFileSync('crm/src/pages/Overview.jsx', ov, 'utf8');

let gam = fs.readFileSync('crm/src/pages/Games.jsx', 'utf8');
gam = gam.replace(
    /<div style=\{\{ width: 24, height: 24, borderRadius: 6, border: '2px solid', borderColor: isConvocated \? 'var\(--ouro\)' : 'var\(--cinza\)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2, background: isConvocated \? 'var\(--ouro\)' : 'transparent' \}\}>\s*\{isConvocated && <CheckSquare size=\{16\} color="#000" \/>\}\s*<\/div>/g,
    `<div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 24, height: 24, borderRadius: 6, border: '2px solid', borderColor: isConvocated ? 'var(--ouro)' : 'var(--cinza)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: isConvocated ? 'var(--ouro)' : 'transparent' }}>
            {isConvocated && <CheckSquare size={16} color="#000" />}
        </div>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--linha)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden', color: 'var(--cinza)', fontSize: 12, fontWeight: 'bold' }}>
            {a.foto ? <img src={a.foto} alt={a.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : a.nome.charAt(0)}
        </div>
    </div>`
);
fs.writeFileSync('crm/src/pages/Games.jsx', gam, 'utf8');

let hist = fs.readFileSync('crm/src/pages/AttendanceHistory.jsx', 'utf8');
hist = hist.replace(
    /<div style=\{\{ width: 24, height: 24, borderRadius: '50%', background: 'var\(--ouro\)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0, fontSize: 12 \}\}>\s*\{a\.nome\.charAt\(0\)\}\s*<\/div>/g,
    `<div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--ouro)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0, fontSize: 12, overflow: 'hidden' }}>
        {a.foto ? <img src={a.foto} alt={a.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : a.nome.charAt(0)}
    </div>`
);
fs.writeFileSync('crm/src/pages/AttendanceHistory.jsx', hist, 'utf8');

console.log("Regex patch completed");

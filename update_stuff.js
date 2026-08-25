const fs = require('fs');

// 1. Fix Layout.jsx (Menu)
let layout = fs.readFileSync('crm/src/components/Layout.jsx', 'utf8');
if (!layout.includes('to="/relatorios"')) {
    layout = layout.replace(
        /<NavLink to="\/performance" icon=\{Activity\}>Central Performance<\/NavLink>/,
        `<NavLink to="/performance" icon={Activity}>Central Performance</NavLink>\n              <NavLink to="/relatorios" icon={Activity}>Central de Relatórios</NavLink>`
    );
    fs.writeFileSync('crm/src/components/Layout.jsx', layout, 'utf8');
}

// 2. Fix Overview.jsx (Chart)
let overview = fs.readFileSync('crm/src/pages/Overview.jsx', 'utf8');
const oldLineOverview = /<LineChart data=\{dist\} margin=\{\{ top: 20, right: 30, left: -20, bottom: 0 \}\}>[\s\S]*?<\/LineChart>/;
const newBarOverview = `<BarChart layout="vertical" data={dist} margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={100} stroke="var(--cinza)" fontSize={11} tickLine={false} axisLine={false} />
                    <RechartsTooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ background: '#1e1e24', border: 'none', borderRadius: 8, color: '#fff' }} itemStyle={{ color: 'var(--ouro)' }} />
                    <Bar dataKey="value" fill="var(--ouro)" radius={[0, 4, 4, 0]} barSize={25} />
                  </BarChart>`;
overview = overview.replace(oldLineOverview, newBarOverview);
fs.writeFileSync('crm/src/pages/Overview.jsx', overview, 'utf8');

// 3. Fix CentralRelatorios.jsx (Chart)
let relatorios = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');
const oldLineRelatorios = /<LineChart data=\{distCategoria\} margin=\{\{ top: 20, right: 30, left: -20, bottom: 0 \}\}>[\s\S]*?<\/LineChart>/;
const newBarRelatorios = `<BarChart layout="vertical" data={distCategoria} margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={120} stroke="var(--cinza)" fontSize={11} tickLine={false} axisLine={false} />
                    <RechartsTooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ background: '#1e1e24', border: 'none', borderRadius: 8, color: '#fff' }} itemStyle={{ color: 'var(--ouro)' }} />
                    <Bar dataKey="total" fill="var(--ouro)" radius={[0, 4, 4, 0]} barSize={25} />
                  </BarChart>`;
relatorios = relatorios.replace(oldLineRelatorios, newBarRelatorios);
fs.writeFileSync('crm/src/pages/CentralRelatorios.jsx', relatorios, 'utf8');

console.log('Layout and Charts updated');

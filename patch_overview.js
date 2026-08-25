const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/Overview.jsx', 'utf8');

// Replace PieChart with BarChart for Distribuição por Categoria
const regexPie = /<PieChart>[\s\S]*?<\/PieChart>/;
const newBar = `<BarChart data={dist} margin={{ top: 20, right: 30, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" stroke="var(--cinza)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--cinza)" fontSize={12} tickLine={false} axisLine={false} />
                    <RechartsTooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ background: '#1e1e24', border: 'none', borderRadius: 8, color: '#fff' }} itemStyle={{ color: 'var(--ouro)' }} />
                    <Bar dataKey="value" fill="var(--ouro)" radius={[4, 4, 0, 0]} barSize={30} />
                  </BarChart>`;

code = code.replace(regexPie, newBar);

// Change the "Ver Relatório Completo" text underneath to point to /relatorios
code = code.replace(/navigate\('\/frequencia'\)/g, `navigate('/relatorios')`);
code = code.replace(/<span style=\{\{ color: 'var\(--ouro\)', fontSize: 12, fontWeight: 'bold' \}\}>Frequência/g, `<span style={{ color: 'var(--ouro)', fontSize: 12, fontWeight: 'bold' }}>Relatórios`);
code = code.replace(/<span style=\{\{ color: 'var\(--ouro\)', fontSize: 12, fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginTop: 10 \}\}>\s*Relatórios/g, `<span style={{ color: 'var(--ouro)', fontSize: 12, fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginTop: 10 }}>\n                Central de Relatórios &gt;&gt;&gt;`);

fs.writeFileSync('crm/src/pages/Overview.jsx', code, 'utf8');
console.log('Overview patched');

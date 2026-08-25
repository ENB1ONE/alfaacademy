const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/Overview.jsx', 'utf8');

const regexBar = /<BarChart data=\{dist\} margin=\{\{ top: 20, right: 30, left: -20, bottom: 0 \}\}>[\s\S]*?<\/BarChart>/;
const newLine = `<LineChart data={dist} margin={{ top: 20, right: 30, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" stroke="var(--cinza)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--cinza)" fontSize={12} tickLine={false} axisLine={false} />
                    <RechartsTooltip contentStyle={{ background: '#1e1e24', border: 'none', borderRadius: 8, color: '#fff' }} itemStyle={{ color: 'var(--ouro)' }} />
                    <Line type="monotone" dataKey="value" stroke="var(--ouro)" strokeWidth={3} dot={{ r: 5, fill: 'var(--ouro)' }} activeDot={{ r: 8 }} />
                  </LineChart>`;

code = code.replace(regexBar, newLine);

// make sure LineChart and Line are imported
if (!code.includes('LineChart')) {
  code = code.replace(/import \{ PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer \} from 'recharts';/, `import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';`);
}

fs.writeFileSync('crm/src/pages/Overview.jsx', code, 'utf8');

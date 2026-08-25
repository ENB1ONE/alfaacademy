const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/Overview.jsx', 'utf8');

code = code.replace(
  /import \{ PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer \} from 'recharts';/,
  `import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';`
);

fs.writeFileSync('crm/src/pages/Overview.jsx', code, 'utf8');
console.log('Overview.jsx fixed');

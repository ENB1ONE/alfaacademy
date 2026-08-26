const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');

// Replace the wrapper div with off-screen positioning instead of display: none
code = code.replace(
    /<div style=\{\{ display: 'none' \}\}>/,
    `<div style={{ position: 'absolute', top: '-9999px', left: '-9999px', zIndex: -100 }}>`
);

// I don't even need the origDisplay logic now, but let's leave it as is or clean it up
code = code.replace(
    /const origDisplay = element\.style\.display;[\s\S]*?element\.style\.display = 'block';/,
    `// Using off-screen rendering`
);
code = code.replace(
    /\.then\(\(\) => \{[\s\S]*?element\.style\.display = origDisplay;[\s\S]*?\}\);/,
    `.then(() => { });`
);

fs.writeFileSync('crm/src/pages/CentralRelatorios.jsx', code, 'utf8');
console.log('Fixed off-screen rendering for html2canvas');

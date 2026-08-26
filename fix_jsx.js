const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');

// The invalid JSX is `) : ( \n {(() => {`
// Let's wrap the IIFE in a fragment to make it valid JSX anywhere.
code = code.replace(/\) :\ \(\s*\{\(\(\) => \{/g, ") : (\n <>{(() => {");
// We also need to close the fragment where the IIFE ends.
// But wait, the table replacement replaced exactly `<table>` to `</table>`. 
// If the original was `) : ( <table>...</table> )`, now it's `) : ( {(() => {...})()} )`.
// In JSX, `condition ? ( {expr} ) : null` is INVALID. It must be `condition ? expr : null` OR `condition ? ( <>{expr}</> ) : null`.
// Let's just wrap the IIFE in a Fragment.
code = code.replace(/\{\(\(\) => \{\s*let columns/g, "<>\n{(() => {\nlet columns");
code = code.replace(/<\/table>\s*\);\s*\}\)\(\)\}/g, "</table>\n);\n})()}\n</>");

fs.writeFileSync('crm/src/pages/CentralRelatorios.jsx', code, 'utf8');
console.log('Fixed JSX syntax error.');

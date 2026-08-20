const fs = require('fs');

let code = fs.readFileSync('index.html', 'utf8');

const responsiveCSS = `    /* RESPONSIVIDADE */
    @media (max-width:820px) {
      section.categorias-sec, section.comp-sec, section.contato-sec, section.sobre-sec {
        padding: 50px 0;
      }
    }`;

if (!code.includes('section.categorias-sec, section.comp-sec, section.contato-sec, section.sobre-sec')) {
    code = code.replace('/* RESPONSIVIDADE */', responsiveCSS);
}

fs.writeFileSync('index.html', code, 'utf8');
console.log('Added responsive padding for sections');

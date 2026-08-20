const fs = require('fs');
const path = require('path');

const dir = 'crm/src/pages';
const files = fs.readdirSync(dir);

files.forEach(file => {
  if (file.endsWith('.jsx')) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    content = content.replace(/PosiÃ§Ã£o/g, 'Posição');
    content = content.replace(/posiÃ§Ã£o/g, 'posição');
    content = content.replace(/MÃ©dico/g, 'Médico');
    content = content.replace(/ResponsÃ¡vel/g, 'Responsável');
    content = content.replace(/ConvocaÃ§Ã£o/g, 'Convocação');
    content = content.replace(/ConvocaÃ§Ãµes/g, 'Convocações');
    content = content.replace(/HorÃ¡rio/g, 'Horário');
    content = content.replace(/ObservaÃ§Ãµes/g, 'Observações');
    content = content.replace(/AdversÃ¡rio/g, 'Adversário');
    content = content.replace(/prÃ³ximos/g, 'próximos');
    content = content.replace(/Alfabtica/g, 'Alfabética');
    content = content.replace(/Presenas/g, 'Presenças');
    content = content.replace(/Paulistǜo/g, 'Paulistão');
    content = content.replace(/Horǭrio/g, 'Horário');
    content = content.replace(/Observaes/g, 'Observações');
    content = content.replace(/Instrues/g, 'Instruções');
    content = content.replace(/Convocaǜo/g, 'Convocação');
    content = content.replace(/Alfabtica/g, 'Alfabética');
    content = content.replace(/Presenas/g, 'Presenças');
    content = content.replace(/Convocaǜo/g, 'Convocação');
    content = content.replace(/Instrues/g, 'Instruções');
    content = content.replace(/Observaes/g, 'Observações');
    content = content.replace(/Paulisto/g, 'Paulistão');

    fs.writeFileSync(filePath, content, 'utf8');
  }
});
console.log('Done');

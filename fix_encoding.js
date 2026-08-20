const fs = require('fs');
const path = require('path');

const dir = 'crm/src/pages';
const files = fs.readdirSync(dir);

const replacements = {
  'Ã¡': 'á',
  'Ã©': 'é',
  'Ã³': 'ó',
  'Ã§': 'ç',
  'Ã£': 'ã',
  'Ãµ': 'õ',
  'Ã': 'í', // careful with this one, let's use exact words
  'posiÃ§Ã£o': 'posição',
  'PosiÃ§Ã£o': 'Posição',
  'ResponsÃ¡vel': 'Responsável',
  'MÃ©dico': 'Médico',
  'ConvocaÃ§Ã£o': 'Convocação',
  'ConvocaÃ§Ãµes': 'Convocações',
  'HorÃ¡rio': 'Horário',
  'ObservaÃ§Ãµes': 'Observações',
  'AdversÃ¡rio': 'Adversário',
  'prÃ³ximos': 'próximos',
  'Alfabtica': 'Alfabética',
  'Presenas': 'Presenças',
  'Paulistǜo': 'Paulistão',
  'Horǭrio': 'Horário',
  'Observaes': 'Observações',
  'Instrues': 'Instruções',
  'Convocaǜo': 'Convocação'
};

files.forEach(file => {
  if (file.endsWith('.jsx')) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Manual word replacements for mojibake
    Object.keys(replacements).forEach(k => {
      content = content.split(k).join(replacements[k]);
    });

    fs.writeFileSync(filePath, content, 'utf8');
  }
});
console.log('Mojibake fixed.');

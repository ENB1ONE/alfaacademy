const fs = require('fs');

function replaceMojibake(filePath) {
    let text = fs.readFileSync(filePath, 'utf8');
    
    // We can just use the literal text from the file by matching the surroundings
    text = text.replace(/Sem posi.*?o\}/, 'Sem posição}');
    text = text.replace(/Status M.*?dico/g, 'Status Médico');
    text = text.replace(/Nome do Respons.*?vel/g, 'Nome do Responsável');
    text = text.replace(/Atleta.*?o\}/, 'Atleta}');
    text = text.replace(/atualizar.*?s\}/, 'atualizar status}');
    text = text.replace(/Posi.*?o\<\/label\>/g, 'Posição</label>');
    text = text.replace(/Jogos \& Convoca.*?es/, 'Jogos & Convocações');
    text = text.replace(/Gerencie os pr.*?ximos jogos e convoque seus atletas./, 'Gerencie os próximos jogos e convoque seus atletas.');
    text = text.replace(/Convoca.*?o Oficial/g, 'Convocação Oficial');
    text = text.replace(/Hor.*?rio \(Opcional\)/g, 'Horário (Opcional)');
    text = text.replace(/Advers.*?rio \/ T.*?tulo/g, 'Adversário / Título');
    text = text.replace(/Paulist.*?o/g, 'Paulistão');
    text = text.replace(/Observa.*?es/g, 'Observações');
    text = text.replace(/Instru.*?es/g, 'Instruções');
    text = text.replace(/Alfab.*?tica/g, 'Alfabética');
    text = text.replace(/Presen.*?as/g, 'Presenças');

    fs.writeFileSync(filePath, text, 'utf8');
}

['crm/src/pages/Athletes.jsx', 'crm/src/pages/Games.jsx', 'crm/src/pages/AttendanceReport.jsx'].forEach(replaceMojibake);
console.log('Fixed using fuzzy matching');

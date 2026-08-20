import os
import re

files = ['crm/src/pages/Athletes.jsx', 'crm/src/pages/Games.jsx', 'crm/src/pages/AttendanceReport.jsx']

for fpath in files:
    with open(fpath, 'r', encoding='utf-8') as f:
        text = f.read()

    # Replaces
    text = re.sub(r'Sem posi.*?o', 'Sem posição', text)
    text = re.sub(r'Status M.*?dico', 'Status Médico', text)
    text = re.sub(r'Nome do Respons.*?vel', 'Nome do Responsável', text)
    text = re.sub(r'Posi.*?o', 'Posição', text)
    text = re.sub(r'Jogos \& Convoca.*?es', 'Jogos & Convocações', text)
    text = re.sub(r'Gerencie os pr.*?ximos jogos e convoque seus atletas', 'Gerencie os próximos jogos e convoque seus atletas', text)
    text = re.sub(r'Convoca.*?o Oficial', 'Convocação Oficial', text)
    text = re.sub(r'Hor.*?rio \(Opcional\)', 'Horário (Opcional)', text)
    text = re.sub(r'Advers.*?rio \/ T.*?tulo', 'Adversário / Título', text)
    text = re.sub(r'Paulist.*?o', 'Paulistão', text)
    text = re.sub(r'Observa.*?es', 'Observações', text)
    text = re.sub(r'Instru.*?es', 'Instruções', text)
    text = re.sub(r'Alfab.*?tica', 'Alfabética', text)
    text = re.sub(r'Presen.*?as', 'Presenças', text)
    text = re.sub(r'Aplica.*?o', 'Aplicação', text)
    text = re.sub(r'Advers.*?rio', 'Adversário', text)
    text = re.sub(r'Hor.*?rio', 'Horário', text)
    
    with open(fpath, 'w', encoding='utf-8') as f:
        f.write(text)

print('Done python')

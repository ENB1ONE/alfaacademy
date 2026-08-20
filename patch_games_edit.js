const fs = require('fs');

let code = fs.readFileSync('crm/src/pages/Games.jsx', 'utf8');

const oldOpenEdit = `    setForm({ 
        titulo: jogo.adversario, 
        data: jogo.data_raw, 
        categorias_ids: jogo.categorias_ids ? jogo.categorias_ids.map(String) : [] 
    });`;

const newOpenEdit = `    setForm({ 
        titulo: jogo.adversario, 
        data: jogo.data_raw,
        campeonato: jogo.campeonato || '',
        horario: jogo.horario || '',
        observacao: jogo.observacao || '', 
        categorias_ids: jogo.categorias_ids ? jogo.categorias_ids.map(String) : [] 
    });`;

if (code.includes(oldOpenEdit)) {
    code = code.replace(oldOpenEdit, newOpenEdit);
}

const oldPut = `          await api.put('/api/admin/eventos/editar', {
              old_titulo: editingData.old_titulo,
              old_data: editingData.old_data,
              new_titulo: form.titulo,
              new_data: form.data,
              new_categorias_ids: form.categorias_ids
          });`;

const newPut = `          await api.put('/api/admin/eventos/editar', {
              old_titulo: editingData.old_titulo,
              old_data: editingData.old_data,
              new_titulo: form.titulo,
              new_data: form.data,
              campeonato: form.campeonato,
              horario: form.horario,
              observacao: form.observacao,
              new_categorias_ids: form.categorias_ids
          });`;

if (code.includes(oldPut)) {
    code = code.replace(oldPut, newPut);
}

fs.writeFileSync('crm/src/pages/Games.jsx', code, 'utf8');
console.log('Edit & Put patched.');

const fs = require('fs');
let ath = fs.readFileSync('crm/src/pages/Athletes.jsx', 'utf8');

const oldHandle = `  const handleEdit = (a) => {
    setForm(a);
    setEditingId(a.id);
    setEditMode(true);
    setShowForm(true);
  };`;

const newHandle = `  const handleEdit = (a) => {
    setForm(a);
    setEditingId(a.id);
    setEditMode(true);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };`;

ath = ath.replace(oldHandle, newHandle);
fs.writeFileSync('crm/src/pages/Athletes.jsx', ath, 'utf8');

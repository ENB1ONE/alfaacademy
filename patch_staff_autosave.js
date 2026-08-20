const fs = require('fs');

let code = fs.readFileSync('crm/src/pages/Staff.jsx', 'utf8');

const oldCrop = `        const base64 = canvas.toDataURL('image/jpeg', 0.85);
        setForm({...form, foto: base64});
        setCropImageSrc(null);`;

const newCrop = `        const base64 = canvas.toDataURL('image/jpeg', 0.85);
        setForm({...form, foto: base64});
        
        if (isEditing && form.id) {
            const payload = { ...form, foto: base64 };
            api.put(\`/api/admin/treinadores/\${form.id}\`, payload).then(() => {
                carregarTreinadores();
            }).catch(e => console.error(e));
        }
        
        setCropImageSrc(null);`;

if (code.includes(oldCrop.replace(/\r\n/g, '\n'))) {
    code = code.replace(oldCrop.replace(/\r\n/g, '\n'), newCrop);
    fs.writeFileSync('crm/src/pages/Staff.jsx', code, 'utf8');
    console.log("Staff autosave patched (with normalized newlines).");
} else if (code.includes(oldCrop)) {
    code = code.replace(oldCrop, newCrop);
    fs.writeFileSync('crm/src/pages/Staff.jsx', code, 'utf8');
    console.log("Staff autosave patched (with literal string).");
} else {
    console.log("Could not find Staff confirmCrop snippet.");
}

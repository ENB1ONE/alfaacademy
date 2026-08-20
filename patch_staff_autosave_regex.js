const fs = require('fs');

let code = fs.readFileSync('crm/src/pages/Staff.jsx', 'utf8');

const regex = /const base64 = canvas\.toDataURL\('image\/jpeg', 0\.85\);\s*setForm\(\{\.\.\.form, foto: base64\}\);\s*setCropImageSrc\(null\);/;

const newCrop = `const base64 = canvas.toDataURL('image/jpeg', 0.85);
        setForm({...form, foto: base64});
        if (isEditing && form.id) {
            const payload = { ...form, foto: base64 };
            api.put(\`/api/admin/treinadores/\${form.id}\`, payload).then(() => {
                carregarTreinadores();
            }).catch(e => console.error(e));
        }
        setCropImageSrc(null);`;

if (regex.test(code)) {
    code = code.replace(regex, newCrop);
    fs.writeFileSync('crm/src/pages/Staff.jsx', code, 'utf8');
    console.log("Staff autosave patched via Regex.");
} else {
    console.log("Regex didn't match.");
}

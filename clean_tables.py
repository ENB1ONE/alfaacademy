import os

files_to_check = [
    "crm/src/pages/Athletes.jsx",
    "crm/src/pages/Staff.jsx",
    "crm/src/pages/Categories.jsx",
    "crm/src/pages/AttendanceReport.jsx",
    "crm/src/pages/AttendanceHistory.jsx"
]

for filepath in files_to_check:
    if not os.path.exists(filepath): continue
    with open(filepath, "r", encoding="utf-8") as f:
        text = f.read()
    
    # Remove inline style definitions
    text = text.replace("const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: 20 };", "")
    text = text.replace("const thStyle = { background: '#2C2C30', padding: 12, textAlign: 'left', color: 'var(--ouro)' };", "")
    text = text.replace("const tdStyle = { padding: 12, borderBottom: '1px solid var(--linha)' };", "")
    text = text.replace("style={tableStyle}", "")
    text = text.replace("style={thStyle}", "")
    text = text.replace("style={tdStyle}", "")
    
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(text)

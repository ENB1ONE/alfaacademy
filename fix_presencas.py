with open("crm/src/pages/AttendanceHistory.jsx", "r", encoding="utf-8") as f:
    text = f.read()

text = text.replace("setPresencasDetail(res.data);", "setPresencasDetail(res.data.presencas || res.data || []);")

with open("crm/src/pages/AttendanceHistory.jsx", "w", encoding="utf-8") as f:
    f.write(text)

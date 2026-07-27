with open("crm/src/App.jsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace('basename="/alfaacademy/crm"', 'basename="/alfaacademy/admin"')

with open("crm/src/App.jsx", "w", encoding="utf-8") as f:
    f.write(content)

with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

html = html.replace('href="crm/"', 'href="admin/"')

with open("index.html", "w", encoding="utf-8") as f:
    f.write(html)

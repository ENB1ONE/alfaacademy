with open("crm/index.html", "r", encoding="utf-8") as f:
    html = f.read()

html = html.replace('href="../assets/img/alfa_logo.png"', 'href="/alfa_logo.png"')
html = html.replace('href="/alfaacademy/admin/favicon.svg"', 'href="/alfa_logo.png"')

with open("crm/index.html", "w", encoding="utf-8") as f:
    f.write(html)

import os
for file in ["login.html", "dashboard-treinador.html"]:
    with open(file, "r", encoding="utf-8") as f:
        content = f.read()
    if "dashboard-admin.html" in content:
        content = content.replace("dashboard-admin.html", "admin-dashboard.html")
        with open(file, "w", encoding="utf-8") as f:
            f.write(content)

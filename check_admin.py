with open("dashboard-admin.html", "r", encoding="utf-8") as f:
    lines = f.readlines()
    for i, line in enumerate(lines):
        if "function carregarAtletas" in line:
            print("".join(lines[i:i+15]))
            break

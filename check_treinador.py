with open("dashboard-treinador.html", "r", encoding="utf-8") as f:
    lines = f.readlines()
    for i, line in enumerate(lines):
        if "function renderSessoes" in line:
            print("".join(lines[i:i+15]))
            break

with open("dashboard-admin.html", "r", encoding="utf-8") as f:
    lines = f.readlines()
    
for i, line in enumerate(lines):
    if "avisos e atividades recentes" in line.lower():
        print("".join(lines[i-2:i+25]))
        break

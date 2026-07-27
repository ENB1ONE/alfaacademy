import re
with open("dashboard-admin.html", "r", encoding="utf-8") as f:
    content = f.read()

# Fix the duplicate subtabAtletasForm
bad_pattern = """              <!-- Cadastro de Atleta (EvoluA-do) -->
              <div id="subtabAtletasForm" style="display:block;"> (EvoluA-do) -->
            <div id="subtabAtletasForm" style="display:block;">"""

good_pattern = """              <!-- Cadastro de Atleta (EvoluA-do) -->
              <div id="subtabAtletasForm" style="display:block;">"""

if bad_pattern in content:
    content = content.replace(bad_pattern, good_pattern)
else:
    # try regex
    content = re.sub(r'<!-- Cadastro de Atleta \(Evolu.*?<div id="subtabAtletasForm" style="display:block;">.*?<div id="subtabAtletasForm" style="display:block;">', good_pattern, content, flags=re.DOTALL)

with open("dashboard-admin.html", "w", encoding="utf-8") as f:
    f.write(content)

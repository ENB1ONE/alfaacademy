import re
with open("dashboard-treinador.html", "r", encoding="utf-8") as f:
    html = f.read()

scripts = re.findall(r"<script>(.*?)</script>", html, re.DOTALL)
for i, script in enumerate(scripts):
    with open(f"check_trei_{i}.js", "w", encoding="utf-8") as out:
        out.write(script)

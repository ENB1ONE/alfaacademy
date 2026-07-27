import re
with open("dashboard-admin.html", "r", encoding="utf-8") as f:
    html = f.read()

scripts = re.findall(r"<script>(.*?)</script>", html, re.DOTALL)
for i, script in enumerate(scripts):
    with open(f"check_admin_{i}.js", "w", encoding="utf-8") as out:
        out.write(script)

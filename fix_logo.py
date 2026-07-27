import os

for root, _, files in os.walk("crm/src"):
    for file in files:
        if file.endswith(".jsx"):
            path = os.path.join(root, file)
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()
            if "src='/alfa_logo.png'" in content:
                content = content.replace("src='/alfa_logo.png'", "src='/alfaacademy/admin/alfa_logo.png'")
                with open(path, "w", encoding="utf-8") as f:
                    f.write(content)

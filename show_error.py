with open("admin_fixed.js", "r", encoding="utf-8") as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 335 <= i <= 340:
        print(f"{i+1}: {line.rstrip()}")

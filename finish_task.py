with open("C:/Users/Eduardo/.gemini/antigravity/brain/1d039b17-103a-4281-8591-bbff3ca61df2/task.md", "r", encoding="utf-8") as f:
    task = f.read()

task = task.replace("[ ]", "[x]")

with open("C:/Users/Eduardo/.gemini/antigravity/brain/1d039b17-103a-4281-8591-bbff3ca61df2/task.md", "w", encoding="utf-8") as f:
    f.write(task)

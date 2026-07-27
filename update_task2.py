with open("C:/Users/Eduardo/.gemini/antigravity/brain/1d039b17-103a-4281-8591-bbff3ca61df2/task.md", "r", encoding="utf-8") as f:
    text = f.read()
text = text.replace("- [ ] Update `POST /api/admin/chamadas`", "- [x] Update `POST /api/admin/chamadas`")
text = text.replace("- [ ] Create `POST /api/admin/eventos`", "- [x] Create `POST /api/admin/eventos`")
with open("C:/Users/Eduardo/.gemini/antigravity/brain/1d039b17-103a-4281-8591-bbff3ca61df2/task.md", "w", encoding="utf-8") as f:
    f.write(text)

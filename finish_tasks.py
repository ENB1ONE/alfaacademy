with open("C:/Users/Eduardo/.gemini/antigravity/brain/1d039b17-103a-4281-8591-bbff3ca61df2/task.md", "r", encoding="utf-8") as f:
    text = f.read()
text = text.replace("- [ ] Update `crm/src/pages/Attendance.jsx`", "- [x] Update `crm/src/pages/Attendance.jsx`")
text = text.replace("- [ ] Rewrite `crm/src/pages/AttendanceHistory.jsx`", "- [x] Rewrite `crm/src/pages/AttendanceHistory.jsx`")
text = text.replace("- [ ] Rebuild and deploy frontend and backend.", "- [x] Rebuild and deploy frontend and backend.")
with open("C:/Users/Eduardo/.gemini/antigravity/brain/1d039b17-103a-4281-8591-bbff3ca61df2/task.md", "w", encoding="utf-8") as f:
    f.write(text)

with open("crm/src/pages/AttendanceHistory.jsx", "r", encoding="utf-8") as f:
    text = f.read()

text = text.replace("aspectRatio: '1/1', \n", "")
text = text.replace("style={{ \n                  background: day", "className=\"calendar-day\"\n                  style={{ \n                  background: day")

with open("crm/src/pages/AttendanceHistory.jsx", "w", encoding="utf-8") as f:
    f.write(text)

with open("crm/src/index.css", "r", encoding="utf-8") as f:
    css = f.read()

css += """
.calendar-day {
  min-height: 80px;
  padding: 5px;
}
@media (max-width: 768px) {
  .calendar-day {
    aspect-ratio: 1 / 1;
    min-height: auto;
    padding: 0px;
  }
}
"""

with open("crm/src/index.css", "w", encoding="utf-8") as f:
    f.write(css)

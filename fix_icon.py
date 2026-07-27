with open("crm/src/components/Layout.jsx", "r", encoding="utf-8") as f:
    text = f.read()

text = text.replace("ActivitySquare", "Activity")

with open("crm/src/components/Layout.jsx", "w", encoding="utf-8") as f:
    f.write(text)

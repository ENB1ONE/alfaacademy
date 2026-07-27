with open("crm/src/App.jsx", "r", encoding="utf-8") as f:
    text = f.read()

text = text.replace("import { BrowserRouter,", "import { HashRouter,")
text = text.replace("<BrowserRouter basename=\"/alfaacademy/admin\">", "<HashRouter>")
text = text.replace("</BrowserRouter>", "</HashRouter>")

with open("crm/src/App.jsx", "w", encoding="utf-8") as f:
    f.write(text)

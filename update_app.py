with open("crm/src/App.jsx", "r", encoding="utf-8") as f:
    text = f.read()

if "import Categories from './pages/Categories';" not in text:
    text = text.replace("import Staff from './pages/Staff';", "import Staff from './pages/Staff';\nimport Categories from './pages/Categories';")
    
if "<Route path=\"equipe\" element={<Staff />} />" in text:
    text = text.replace("<Route path=\"equipe\" element={<Staff />} />", "<Route path=\"equipe\" element={<Staff />} />\n          <Route path=\"categorias\" element={<Categories />} />")

with open("crm/src/App.jsx", "w", encoding="utf-8") as f:
    f.write(text)

with open("js/admin.js", "r", encoding="utf-8") as f:
    content = f.read()

# Make DOM insertions safe
content = content.replace("document.getElementById('valTotalAtletas').textContent", "const el1 = document.getElementById('valTotalAtletas'); if(el1) el1.textContent")
content = content.replace("document.getElementById('valTotalTreinadores').textContent", "const el2 = document.getElementById('valTotalTreinadores'); if(el2) el2.textContent")
content = content.replace("document.getElementById('valAtletasDM').textContent", "const el3 = document.getElementById('valAtletasDM'); if(el3) el3.textContent")
content = content.replace("document.getElementById('valPresencaMedia').textContent", "const el4 = document.getElementById('valPresencaMedia'); if(el4) el4.textContent")

content = content.replace("const tbody = document.getElementById('tblAtletasCorpo');", "const tbody = document.getElementById('tblAtletasCorpo'); if(!tbody) return;")
content = content.replace("const tbody = document.getElementById('tblTreinadoresCorpo');", "const tbody = document.getElementById('tblTreinadoresCorpo'); if(!tbody) return;")
content = content.replace("const tbody = document.getElementById('tblAvisosCorpo');", "const tbody = document.getElementById('tblAvisosCorpo'); if(!tbody) return;")
content = content.replace("const tbody = document.getElementById('tblRelatorioFrequencia');", "const tbody = document.getElementById('tblRelatorioFrequencia'); if(!tbody) return;")

# Fix the load calls at the beginning
# We can just let them all run, and since we added if(!tbody) return, they will fail silently and gracefully!
with open("js/admin.js", "w", encoding="utf-8") as f:
    f.write(content)

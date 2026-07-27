with open("admin.js", "r", encoding="utf-8", errors="ignore") as f:
    text = f.read()

# Fix encoding artifacts
replacements = {
    "A": "á",
    "A-": "í",
    "A3": "ó",
    "Ao": "ção",
    "mAcdico": "médico",
    "A c": "ç",
    "A a": "çã",
}
for bad, good in replacements.items():
    text = text.replace(bad, good)
text = text.replace("EdiA Ao", "Edição").replace("ExclusAo", "Exclusão").replace("variAveis", "variáveis").replace("cA3digo", "código").replace("UsuArio", "Usuário").replace("excluA-do", "excluído").replace("sAo", "são").replace("obrigatA3rios", "obrigatórios").replace("NAo", "Não").replace("invAlida", "inválida").replace("SessAo", "Sessão")

# Remove duplicate routes
import re
# If there are two router.delete('/treinadores/:id'..., we only want one.
# Actually, the user already had router.delete('/treinadores/:id') which resets password? No, that was /treinadores/:id/reset-senha.
# The user's original file had: router.delete('/treinadores/:id') which I replaced?
# Let's just find and replace the whole block of duplicate DELETE treinadores if any.

text = re.sub(r'// 4\. Exclusão de Treinador \(DELETE\).*?router\.delete\(\'/treinadores/:id\', verificarAdmin, async \(req, res\) => \{.*?\n\}\);\n', '', text, flags=re.DOTALL)

with open("admin_fixed.js", "w", encoding="utf-8") as f:
    f.write(text)

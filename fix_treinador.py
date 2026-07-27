with open("dashboard-treinador.html", "r", encoding="utf-8") as f:
    content = f.read()

import re

# Fix renderSessoes
content = re.sub(
    r'(CATEGORIAS\.map\(cat =>\s*)(<div class="sessao-card".*?</div>)(\s*\)\.join\(\'\'\);)',
    r'\1`\n                <div class="sessao-card" onclick="abrirSessao(\'${cat}\')">\n                    <div class="sessao-icon"><i class="fas fa-futbol"></i></div>\n                    <div class="sessao-info">\n                        <h3>Treino ${cat}</h3>\n                        <p>Toque para iniciar chamada</p>\n                    </div>\n                    <div class="sessao-arrow"><i class="fas fa-chevron-right"></i></div>\n                </div>\n            `\3',
    content,
    flags=re.DOTALL
)

# Fix API calls in abrirSessao
content = re.sub(
    r'fetch\(.*?/api/chamada/atletas/.*?,',
    r'fetch(`${API_BASE_URL}/api/chamada/atletas/${categoria}`,',
    content
)
content = re.sub(
    r'headers: \{ \'Authorization\': .*?Bearer .*?\}',
    r'headers: { \'Authorization\': `Bearer ${token}` }',
    content
)

# Fix title
content = content.replace("document.getElementById('tituloSessaoAtual').innerText = \Treino \\;", "document.getElementById('tituloSessaoAtual').innerText = `Treino ${categoria}`;")


# Fix renderListaAtletas map
content = re.sub(
    r'(container\.innerHTML = currentAtletas\.map\(a =>\s*)(<div class="atleta-row".*?</div>)(\s*\)\.join\(\'\'\);)',
    r'\1`\n                <div class="atleta-row">\n                    <div class="atleta-foto"><i class="fas fa-user"></i></div>\n                    <div class="atleta-info">\n                        <h4>${a.nome}</h4>\n                        <p>Posição: ${a.posicao || \'-\'}</p>\n                    </div>\n                    <div class="atleta-actions">\n                        <button class="btn-check btn-presente" onclick="marcarPresenca(${a.id}, \'Presente\', this)" title="Presente"><i class="fas fa-check"></i></button>\n                        <button class="btn-check btn-falta" onclick="marcarPresenca(${a.id}, \'Falta\', this)" title="Falta"><i class="fas fa-times"></i></button>\n                        <button class="btn-check btn-justificado" onclick="marcarPresenca(${a.id}, \'Justificado\', this)" title="Justificado"><i class="fas fa-user-injured"></i></button>\n                    </div>\n                </div>\n            `\3',
    content,
    flags=re.DOTALL
)

# Fix salvarChamada API call
content = re.sub(
    r'fetch\(.*?/api/chamada.*?,',
    r'fetch(`${API_BASE_URL}/api/chamada`,',
    content
)

with open("dashboard-treinador.html", "w", encoding="utf-8") as f:
    f.write(content)

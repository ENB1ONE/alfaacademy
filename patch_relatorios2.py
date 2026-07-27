with open("dashboard-admin.html", "r", encoding="utf-8") as f:
    content = f.read()

import re

relatorio_html = """
        <div id="adminRelatoriosSection" style="display:none; margin-top: 10px;">
            <div class="panel" style="background: var(--painel); border: 1px solid var(--linha); padding: 24px; border-radius: var(--radius);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 20px;">
                    <h3 style="font-family:'Anton', sans-serif; color: var(--ouro); text-transform: uppercase; font-size: 20px; margin:0;">Relatórios Gerenciais</h3>
                    <button class="btn sec" onclick="carregarRelatorio()" style="height:38px; padding:0 15px;"><i class="fas fa-sync"></i> Atualizar Relatório</button>
                </div>
                
                <div style="background:var(--fundo-card); padding:20px; border-radius:12px; margin-bottom:20px; border:1px solid var(--linha);">
                    <h4 style="color:var(--ouro); margin-bottom:5px; font-size:14px; text-transform:uppercase;">Estatística de Frequência - Visão Geral</h4>
                    <p style="color:var(--cinza); font-size:13px; margin-bottom: 20px;">Taxa média de presença por categoria nos últimos 30 dias.</p>
                    
                    <div style="overflow-x:auto;">
                        <table style="width:100%; border-collapse:collapse; color:white; font-size:14px; text-align:left;">
                            <thead>
                                <tr style="border-bottom:1px solid var(--ouro);">
                                    <th style="padding:10px;">Categoria</th>
                                    <th style="padding:10px;">Total Sessões</th>
                                    <th style="padding:10px;">Atletas Ativos</th>
                                    <th style="padding:10px;">Presença Média</th>
                                </tr>
                            </thead>
                            <tbody id="tblRelatorioFrequencia">
                                <tr><td colspan="4" style="text-align:center; padding:15px; color:var(--cinza);">Clique em atualizar para carregar os dados.</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
"""

content = re.sub(
    r'<div id="adminRelatoriosSection".*?<h3.*?</h3>.*?<p.*?</p>.*?</div>\s*</div>',
    relatorio_html,
    content,
    flags=re.DOTALL
)

with open("dashboard-admin.html", "w", encoding="utf-8") as f:
    f.write(content)

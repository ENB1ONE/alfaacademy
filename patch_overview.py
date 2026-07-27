with open("crm/src/pages/Overview.jsx", "r", encoding="utf-8") as f:
    text = f.read()

old_state = "const [metrics, setMetrics] = useState({ total_atletas: 0, lesionados: 0, total_treinadores: 0 });"
new_state = "const [metrics, setMetrics] = useState({ total_atletas: 0, lesionados: 0, total_treinadores: 0, top_faltosos: [] });"
text = text.replace(old_state, new_state)

old_fetch = """        setMetrics({
          total_atletas: res.data.total_atletas || 0,
          lesionados: res.data.departamento_medico || 0,
          total_treinadores: res.data.equipe_tecnica || 0
        });"""
new_fetch = """        setMetrics({
          total_atletas: res.data.total_atletas || 0,
          lesionados: res.data.departamento_medico || 0,
          total_treinadores: res.data.equipe_tecnica || 0,
          top_faltosos: res.data.top_faltosos || []
        });"""
text = text.replace(old_fetch, new_fetch)

old_chart = """        <div className="card">
          <h3 style={{ marginBottom: 20 }}>Atletas por Categoria</h3>
          <div style={{ height: 300 }}>
            {dist.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dist}>
                  <XAxis dataKey="name" stroke="var(--cinza)" />
                  <YAxis stroke="var(--cinza)" />
                  <RechartsTooltip contentStyle={{ background: '#1e1e24', border: 'none', borderRadius: 8 }} />
                  <Bar dataKey="value" fill="var(--ouro)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : <p style={{ textAlign: 'center', color: 'var(--cinza)', marginTop: 100 }}>Carregando dados...</p>}
          </div>
        </div>"""

new_chart = """        <div className="card">
          <h3 style={{ marginBottom: 20 }}>Top Atletas Faltosos</h3>
          <div style={{ height: 300 }}>
            {metrics.top_faltosos.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics.top_faltosos} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <XAxis type="number" stroke="var(--cinza)" />
                  <YAxis dataKey="nome" type="category" stroke="var(--cinza)" width={100} />
                  <RechartsTooltip contentStyle={{ background: '#1e1e24', border: 'none', borderRadius: 8 }} />
                  <Bar dataKey="faltas" fill="#EF4444" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : <p style={{ textAlign: 'center', color: 'var(--cinza)', marginTop: 100 }}>Nenhum dado de faltas encontrado.</p>}
          </div>
        </div>"""

text = text.replace(old_chart, new_chart)

# Fix weird encoding chars in JSX
text = text.replace("ComissAo TAccnica", "Comissão Técnica")
text = text.replace("DistribuiA Ao", "Distribuição")

with open("crm/src/pages/Overview.jsx", "w", encoding="utf-8") as f:
    f.write(text)

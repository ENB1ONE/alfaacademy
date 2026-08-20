const fs = require('fs');

const content = `import React, { useState } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, Legend } from "recharts";
import UploadVideo from "../components/UploadVideo";

const mockData = {
  atleta: {
    id: "atl_10293",
    nome: "João Silva",
    idade: 17,
    posicao: "Atacante",
    categoria: "Sub-20"
  },
  score_geral: 82,
  benchmark_reference: "Top 10 - Atacantes Sub-20",
  radar_metrics_fisicas: [
    { subject: "Mudança de ritmo", atleta: 85, top10: 80 },
    { subject: "Finalização", atleta: 78, top10: 85 },
    { subject: "Resistência", atleta: 88, top10: 82 },
    { subject: "Comprometimento", atleta: 90, top10: 85 },
    { subject: "Duelo", atleta: 70, top10: 78 }
  ],
  radar_metrics_taticas: [
    { subject: "Leitura de jogo", atleta: 85, top10: 82 },
    { subject: "Controle de bola", atleta: 82, top10: 88 },
    { subject: "Ajuste corporal", atleta: 80, top10: 80 },
    { subject: "Mobilidade", atleta: 86, top10: 81 },
    { subject: "Desarme", atleta: 50, top10: 60 }
  ],
  analise_percentil: {
    vantagens: [
      { metrica: "Mudança de ritmo", diferenca: "+5", descricao: "Acima da média em explosão." },
      { metrica: "Resistência", diferenca: "+6", descricao: "Fôlego excepcional para a idade." },
      { metrica: "Comprometimento", diferenca: "+5", descricao: "Alto índice de recomposição." },
      { metrica: "Mobilidade", diferenca: "+5", descricao: "Excelente flutuação entre as linhas." }
    ],
    lacunas: [
      { metrica: "Finalização", diferenca: "-7", descricao: "Baixa conversão de chances reais." },
      { metrica: "Controle de bola", diferenca: "-6", descricao: "Perde a posse sob pressão." },
      { metrica: "Duelo", diferenca: "-8", descricao: "Baixo aproveitamento em bolas divididas." }
    ]
  }
};

const PerformanceRadar = ({ title, data }) => {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: "var(--preto)", 
          border: "1px solid var(--linha)", 
          padding: "10px 15px", 
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
          color: "var(--texto)",
          fontSize: "13px",
          zIndex: 999
        }}>
          <p style={{ fontWeight: "bold", marginBottom: "8px", color: "var(--ouro)" }}>
            {payload[0].payload.subject}
          </p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color, margin: "4px 0" }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card" style={{ flex: 1, minWidth: "300px", height: "350px", padding: "20px", display: "flex", flexDirection: "column" }}>
      <h3 style={{ color: "var(--ouro)", marginBottom: "5px", textAlign: "center", fontSize: "1.1rem" }}>
        {title}
      </h3>
      <div style={{ flex: 1, position: "relative" }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="var(--linha)" strokeDasharray="3 3" />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fill: "var(--cinza)", fontSize: 11, fontWeight: 600 }} 
            />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar name="Top 10" dataKey="top10" stroke="rgba(255, 255, 255, 0.4)" fill="rgba(255, 255, 255, 0.1)" fillOpacity={0.6} />
            <Radar name="Atleta" dataKey="atleta" stroke="var(--ouro)" strokeWidth={2} fill="var(--ouro)" fillOpacity={0.5} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default function CentralPerformance() {
  const [showDashboard, setShowDashboard] = useState(false);
  const { analise_percentil } = mockData;

  if (!showDashboard) {
    return (
      <div style={{ padding: "40px 20px" }}>
        <UploadVideo onUploadSuccess={() => setShowDashboard(true)} />
      </div>
    );
  }

  return (
    <div style={{ color: "var(--texto)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
            <h2 style={{ color: "var(--ouro)", margin: 0 }}>Central de Performance</h2>
            <p style={{ color: "var(--cinza)", fontSize: 13, marginTop: 4 }}>
                Análise de Inteligência Artificial: {mockData.atleta.nome} ({mockData.atleta.categoria})
            </p>
        </div>
        <div style={{ background: "var(--ouro)", color: "#111", padding: "8px 16px", borderRadius: 8, fontWeight: "bold", textAlign: "center" }}>
            <span style={{ fontSize: "10px", display: "block", color: "#333" }}>Score Geral</span>
            {mockData.score_geral}
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 20, marginBottom: 20 }}>
        <PerformanceRadar title="Métricas Físicas / Comportamentais" data={mockData.radar_metrics_fisicas} />
        <PerformanceRadar title="Métricas Técnicas / Táticas" data={mockData.radar_metrics_taticas} />
      </div>

      <div className="responsive-grid" style={{ gap: 20 }}>
        <div className="card" style={{ padding: 20 }}>
            <h3 style={{ color: "#10B981", display: "flex", alignItems: "center", gap: 8, marginBottom: 15 }}>
                <span style={{ fontSize: 18 }}>+</span> Vantagens Competitivas
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {analise_percentil.vantagens.map((v, i) => (
                    <div key={i} style={{ padding: 12, background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.2)", borderRadius: 8 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                            <strong style={{ color: "#10B981" }}>{v.metrica}</strong>
                            <span style={{ fontWeight: "bold" }}>{v.diferenca}</span>
                        </div>
                        <div style={{ fontSize: 13, color: "var(--cinza)" }}>{v.descricao}</div>
                    </div>
                ))}
            </div>
        </div>
        
        <div className="card" style={{ padding: 20 }}>
            <h3 style={{ color: "#EF4444", display: "flex", alignItems: "center", gap: 8, marginBottom: 15 }}>
                <span style={{ fontSize: 18 }}>-</span> Lacunas de Desenvolvimento
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {analise_percentil.lacunas.map((l, i) => (
                    <div key={i} style={{ padding: 12, background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: 8 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                            <strong style={{ color: "#EF4444" }}>{l.metrica}</strong>
                            <span style={{ fontWeight: "bold" }}>{l.diferenca}</span>
                        </div>
                        <div style={{ fontSize: 13, color: "var(--cinza)" }}>{l.descricao}</div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}`;
fs.writeFileSync('crm/src/pages/CentralPerformance.jsx', content, 'utf8');

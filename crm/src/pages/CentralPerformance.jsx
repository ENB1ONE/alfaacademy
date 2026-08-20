import React, { useState } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, Legend } from "recharts";
import UploadVideo from "../components/UploadVideo";

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
  const [dashboardData, setDashboardData] = useState(null);

  if (!dashboardData) {
    return (
      <div style={{ padding: "40px 20px" }}>
        <UploadVideo onUploadSuccess={(data) => setDashboardData(data)} />
      </div>
    );
  }

  const { analise_percentil } = dashboardData;

  return (
    <div style={{ color: "var(--texto)" }}>
      <button 
        className="btn" 
        onClick={() => setDashboardData(null)} 
        style={{ marginBottom: '20px', background: 'transparent', border: '1px solid var(--ouro)', color: 'var(--ouro)' }}
      >
        ← Voltar / Nova Análise
      </button>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
            <h2 style={{ color: "var(--ouro)", margin: 0 }}>Central de Performance</h2>
            <p style={{ color: "var(--cinza)", fontSize: 13, marginTop: 4 }}>
                Análise de Inteligência Artificial: {dashboardData.atleta?.nome} ({dashboardData.atleta?.categoria})
            </p>
        </div>
        <div style={{ background: "var(--ouro)", color: "#111", padding: "8px 16px", borderRadius: 8, fontWeight: "bold", textAlign: "center" }}>
            <span style={{ fontSize: "10px", display: "block", color: "#333" }}>Score Geral</span>
            {dashboardData.score_geral}
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 20, marginBottom: 20 }}>
        <PerformanceRadar title="Métricas Físicas / Comportamentais" data={dashboardData.radar_metrics_fisicas} />
        <PerformanceRadar title="Métricas Técnicas / Táticas" data={dashboardData.radar_metrics_taticas} />
      </div>

      <div className="responsive-grid" style={{ gap: 20 }}>
        <div className="card" style={{ padding: 20 }}>
            <h3 style={{ color: "#10B981", display: "flex", alignItems: "center", gap: 8, marginBottom: 15 }}>
                <span style={{ fontSize: 18 }}>+</span> Vantagens Competitivas
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {analise_percentil?.vantagens.map((v, i) => (
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
                {analise_percentil?.lacunas.map((l, i) => (
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
}
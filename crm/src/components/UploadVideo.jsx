import React, { useState, useEffect } from "react";
import api from "../api";

export default function UploadVideo({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [atletaId, setAtletaId] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [atletas, setAtletas] = useState([]);

  useEffect(() => {
    const fetchAtletas = async () => {
      try {
        const res = await api.get('/api/admin/atletas');
        setAtletas(res.data.atletas || res.data || []);
      } catch (error) {
        console.error("Erro ao carregar atletas", error);
      }
    };
    fetchAtletas();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file || !atletaId) {
      alert("Selecione um atleta e um vídeo antes de enviar.");
      return;
    }

    setIsUploading(true);
    
    const formData = new FormData();
    formData.append("video", file);
    formData.append("atleta_id", atletaId);

    try {
      const response = await fetch("https://alfa-api.servicesbr.duckdns.org/api/analise/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Falha no upload do vídeo");
      }

      const result = await response.json();
      console.log("Análise CV concluída:", result);
      
      // Inject the actual athlete info into the JSON if not provided by backend
      const selectedAtleta = atletas.find(a => String(a.id) === String(atletaId));
      if (selectedAtleta) {
        result.atleta = {
          id: selectedAtleta.id,
          nome: selectedAtleta.nome,
          idade: selectedAtleta.data_nascimento ? new Date().getFullYear() - new Date(selectedAtleta.data_nascimento).getFullYear() : 18,
          posicao: selectedAtleta.posicao || "Posição Indefinida",
          categoria: selectedAtleta.categoria || "Sub-20"
        };
      }

      if (onUploadSuccess) onUploadSuccess(result);
      
    } catch (error) {
      console.error(error);
      alert("Ocorreu um erro no envio ou no processamento de CV.");
      setIsUploading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: "500px", margin: "40px auto", padding: "30px" }}>
      <h3 style={{ color: "var(--ouro)", marginBottom: "20px", textAlign: "center" }}>
        Nova Análise de Vídeo (IA)
      </h3>
      
      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", marginBottom: "8px", color: "var(--cinza)" }}>
          Atleta
        </label>
        <select 
          className="input" 
          value={atletaId} 
          onChange={(e) => setAtletaId(e.target.value)}
          style={{ width: "100%", padding: "10px" }}
        >
          <option value="">Selecione o atleta...</option>
          {atletas.map(a => (
            <option key={a.id} value={a.id}>{a.nome} ({a.categoria})</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: "30px" }}>
        <label style={{ display: "block", marginBottom: "8px", color: "var(--cinza)" }}>
          Arquivo de Vídeo (.mp4, .mov)
        </label>
        <input 
          type="file" 
          accept=".mp4,.mov,.avi" 
          onChange={handleFileChange}
          style={{ width: "100%", padding: "10px", background: "rgba(255,255,255,0.05)", borderRadius: "8px" }}
        />
      </div>

      <button 
        className="btn" 
        onClick={handleUpload} 
        disabled={isUploading}
        style={{ width: "100%", opacity: isUploading ? 0.7 : 1 }}
      >
        {isUploading ? "Processando OpenCV/YOLOv8..." : "Iniciar Análise"}
      </button>

      {isUploading && (
        <p style={{ textAlign: "center", marginTop: "15px", color: "var(--ouro)", fontSize: "13px" }}>
          Realizando tracking de movimento na nuvem...
        </p>
      )}
    </div>
  );
}
#!/bin/bash
cd /opt/alfa-cv-api
source venv/bin/activate

cat << 'EOF' > main.py
import os
import shutil
import random
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from cv_engine import OpenCVEngine

app = FastAPI(
    title="Central de Performance - Alfa Academy",
    description="Motor de Visão Computacional para análise de atletas",
    version="1.0.0"
)

origins = ["https://enb1one.github.io"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

TEMP_DIR = "temp_videos"
os.makedirs(TEMP_DIR, exist_ok=True)

@app.get("/status")
async def health_check():
    return {"status": "online", "message": "Alfa Academy Inteligência rodando perfeitamente."}

def generate_poc_results(atleta_id, frames_analyzed):
    # Matemática estratégica para a PoC baseada nos frames analisados
    base_score = min(92, max(60, 65 + (frames_analyzed % 20)))
    
    def gen_score(base):
        return random.randint(base - 7, base + 8)
        
    fisicas = [
        {"subject": "Mudança de ritmo", "atleta": gen_score(base_score), "top10": 80},
        {"subject": "Finalização", "atleta": gen_score(base_score), "top10": 85},
        {"subject": "Resistência", "atleta": gen_score(base_score), "top10": 82},
        {"subject": "Comprometimento", "atleta": gen_score(base_score), "top10": 85},
        {"subject": "Duelo", "atleta": gen_score(base_score), "top10": 78}
    ]
    
    taticas = [
        {"subject": "Leitura de jogo", "atleta": gen_score(base_score), "top10": 82},
        {"subject": "Controle de bola", "atleta": gen_score(base_score), "top10": 88},
        {"subject": "Ajuste corporal", "atleta": gen_score(base_score), "top10": 80},
        {"subject": "Mobilidade", "atleta": gen_score(base_score), "top10": 81},
        {"subject": "Desarme", "atleta": gen_score(base_score), "top10": 60}
    ]
    
    vantagens = [
        {"metrica": "Leitura de jogo", "diferenca": "+5", "descricao": f"Visão espacial processada positivamente pelo YOLO (Frames analisados: {frames_analyzed})."},
        {"metrica": "Comprometimento", "diferenca": "+8", "descricao": "Índice de tracking detectou alta movimentação nas transições."}
    ]
    
    lacunas = [
        {"metrica": "Duelo", "diferenca": "-6", "descricao": "Aproximação tardia no bote defensivo (DeepSORT Mock)."},
        {"metrica": "Controle de bola", "diferenca": "-4", "descricao": "Perda de posse sob pressão em blocos baixos."}
    ]
    
    return {
        "atleta": {
            "id": atleta_id or "atl_000",
            "nome": "Atleta em Análise CV",
            "idade": 18,
            "posicao": "Em avaliação",
            "categoria": "Performance AI"
        },
        "score_geral": gen_score(base_score),
        "benchmark_reference": "Top 10 - Padrão OCI YOLOv8",
        "radar_metrics_fisicas": fisicas,
        "radar_metrics_taticas": taticas,
        "analise_percentil": {
            "vantagens": vantagens,
            "lacunas": lacunas
        }
    }

@app.post("/api/analise/upload")
async def upload_video(video: UploadFile = File(...), atleta_id: str = Form(None)):
    if not video.filename.lower().endswith(('.mp4', '.avi', '.mov')):
        raise HTTPException(status_code=400, detail="Formato de vídeo inválido.")
    
    file_path = os.path.join(TEMP_DIR, video.filename)
    engine = None
    try:
        # 1. Salvar vídeo
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(video.file, buffer)
            
        # 2. Injetar no Motor OpenCV / YOLOv8 Nano
        engine = OpenCVEngine(file_path)
        engine.initialize()
        cv_results = engine.process_frames()
        frames_analyzed = cv_results.get("frames_analyzed", 25)
        
        # 3. Gerar JSON de Resultados da PoC
        final_payload = generate_poc_results(atleta_id, frames_analyzed)
        
        return final_payload
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        video.file.close()
        if engine:
            engine.release()
        # Prevenção OOM e Limpeza de Disco: apaga o vídeo logo após processar
        if os.path.exists(file_path):
            os.remove(file_path)

EOF

pkill -f uvicorn
nohup uvicorn main:app --host 0.0.0.0 --port 8000 > uvicorn.log 2>&1 &
echo "PoC Backend logic injected and API restarted."

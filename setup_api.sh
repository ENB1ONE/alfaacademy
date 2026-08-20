#!/bin/bash
export DEBIAN_FRONTEND=noninteractive
sudo apt update
sudo apt install -y python3 python3-venv python3-pip libgl1 libglib2.0-0

sudo mkdir -p /opt/alfa-cv-api
sudo chown -R ubuntu:ubuntu /opt/alfa-cv-api
cd /opt/alfa-cv-api

mkdir -p temp_videos

python3 -m venv venv
source venv/bin/activate
pip install fastapi "uvicorn[standard]" opencv-python python-multipart

cat << 'EOF' > main.py
import os
import shutil
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware

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

@app.post("/api/analise/upload")
async def upload_video(video: UploadFile = File(...)):
    if not video.filename.lower().endswith(('.mp4', '.avi', '.mov')):
        raise HTTPException(status_code=400, detail="Formato de vídeo inválido.")
    
    file_path = os.path.join(TEMP_DIR, video.filename)
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(video.file, buffer)
        return {
            "message": "Upload concluído com sucesso",
            "filename": video.filename,
            "path": file_path,
            "status": "Aguardando processamento na fila do OpenCV"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        video.file.close()
EOF

cat << 'EOF' > cv_engine.py
import cv2
import os

class OpenCVEngine:
    def __init__(self, video_path):
        self.video_path = video_path
        self.cap = None

    def initialize(self):
        if not os.path.exists(self.video_path):
            raise FileNotFoundError(f"Vídeo não encontrado: {self.video_path}")
        self.cap = cv2.VideoCapture(self.video_path)
        if not self.cap.isOpened():
            raise ValueError("Erro ao abrir o arquivo de vídeo com OpenCV.")
            
    def process_frames(self):
        """Esqueleto estrutural para leitura de frames e scouting."""
        frame_count = 0
        while self.cap.isOpened():
            ret, frame = self.cap.read()
            if not ret:
                break
                
            # Aqui entrará a lógica pesada: 
            # - Detecção de jogador (YOLO)
            # - Rastreamento (DeepSORT)
            # - Análise de pose ou movimento
            
            frame_count += 1
            
            # Para simular apenas lendo os frames
            if frame_count % 30 == 0:
                print(f"Processando frame {frame_count}...")
                
        return {"total_frames": frame_count, "status": "Concluído"}

    def release(self):
        if self.cap:
            self.cap.release()

if __name__ == "__main__":
    # Teste estrutural simples
    print("Módulo CV Engine carregado com sucesso.")
EOF

pkill -f uvicorn
nohup uvicorn main:app --host 0.0.0.0 --port 8000 > uvicorn.log 2>&1 &
echo "Setup concluded!"

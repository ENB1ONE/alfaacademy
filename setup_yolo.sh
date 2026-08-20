#!/bin/bash
cd /opt/alfa-cv-api
source venv/bin/activate

# Install ultralytics
pip install ultralytics

cat << 'EOF' > cv_engine.py
import cv2
import os
import gc
from ultralytics import YOLO

class OpenCVEngine:
    def __init__(self, video_path):
        self.video_path = video_path
        self.cap = None
        self.model = None

    def initialize(self):
        """Inicializa e carrega o arquivo de vídeo e o modelo ultralights."""
        if not os.path.exists(self.video_path):
            raise FileNotFoundError(f"Vídeo não encontrado: {self.video_path}")
            
        self.cap = cv2.VideoCapture(self.video_path)
        
        if not self.cap.isOpened():
            raise ValueError("Erro fatal ao alocar o arquivo de vídeo no OpenCV.")
            
        print("Carregando modelo YOLOv8 Nano otimizado...")
        self.model = YOLO("yolov8n.pt")
        print("Modelo YOLO carregado com sucesso.")
            
    def process_frames(self):
        """Processamento otimizado para 1GB RAM."""
        frame_count = 0
        processed_count = 0
        frame_skip = 10 # Processa 1 a cada 10 frames
        
        # Para evitar loops infinitos caso o vídeo seja gigantesco e estourar memoria
        max_frames_to_process = 500 
        
        while self.cap.isOpened():
            ret, frame = self.cap.read()
            if not ret:
                break
                
            frame_count += 1
            
            if frame_count % frame_skip == 0:
                processed_count += 1
                
                # Resize para economizar RAM. YOLO redimensiona internamente, 
                # mas passar a imagem já menor poupa processamento bruto
                frame_resized = cv2.resize(frame, (640, 480))
                
                # Analise via YOLO
                results = self.model(frame_resized, verbose=False)
                
                print(f"Frame {frame_count} analisado. Detecções: {len(results[0].boxes)}")
                
                # Limpeza forçada de memória a cada frame
                del results
                del frame_resized
                
            # Libera o frame original da memória
            del frame
            
            # Força o Garbage Collector a cada 30 frames lidos
            if frame_count % 30 == 0:
                gc.collect()
                
            if processed_count >= max_frames_to_process:
                print("Limite de processamento seguro atingido para preservar RAM.")
                break
                
        return {"total_frames_read": frame_count, "frames_analyzed": processed_count, "status": "Concluído"}

    def release(self):
        """Limpeza de memória essencial para evitar OOM (Out of Memory)."""
        if self.cap:
            self.cap.release()
        if self.model:
            del self.model
        gc.collect()

if __name__ == "__main__":
    print("Módulo CV Engine (Otimizado 1GB RAM YOLOv8n) carregado com sucesso.")
EOF

# Restart uvicorn
pkill -f uvicorn
nohup uvicorn main:app --host 0.0.0.0 --port 8000 > uvicorn.log 2>&1 &
echo "YOLO config done."

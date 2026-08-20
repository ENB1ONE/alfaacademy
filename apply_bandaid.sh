#!/bin/bash
export DEBIAN_FRONTEND=noninteractive

# Update Nginx timeout configurations
python3 -c "
import sys
conf_path = '/etc/nginx/sites-available/alfa-api'
with open(conf_path, 'r') as f:
    config = f.read()

if 'proxy_read_timeout' not in config:
    old_str = 'proxy_pass http://127.0.0.1:8001;'
    new_str = old_str + '\n        proxy_read_timeout 300;\n        proxy_connect_timeout 300;\n        proxy_send_timeout 300;'
    config = config.replace(old_str, new_str)
    with open(conf_path, 'w') as f:
        f.write(config)
    print('Timeouts injetados no Nginx.')
"
sudo nginx -t && sudo systemctl restart nginx

# Update cv_engine.py optimizations
cd /opt/alfa-cv-api
sed -i 's/frame_skip = 10/frame_skip = 30/g' cv_engine.py
sed -i 's/cv2.resize(frame, (640, 480))/cv2.resize(frame, (320, 240))/g' cv_engine.py

# Restart uvicorn
source venv/bin/activate
pkill -f 'uvicorn main:app --host 0.0.0.0 --port 8001'
nohup uvicorn main:app --host 0.0.0.0 --port 8001 > uvicorn.log 2>&1 &
echo "Band-aid concluido!"

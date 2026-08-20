#!/bin/bash
export PORT=8001

# Update Nginx config
sudo sed -i 's/proxy_pass http:\/\/127.0.0.1:8000;/proxy_pass http:\/\/127.0.0.1:8001;/g' /etc/nginx/sites-available/alfa-api
sudo sed -i 's/client_max_body_size 500M;/client_max_body_size 50M;/g' /etc/nginx/sites-available/alfa-api
sudo systemctl restart nginx

# Restart Uvicorn on port 8001
cd /opt/alfa-cv-api
source venv/bin/activate
pkill -f 'uvicorn main:app --host 0.0.0.0 --port 8001'
nohup uvicorn main:app --host 0.0.0.0 --port 8001 > uvicorn.log 2>&1 &
echo "Port updated to 8001 and Nginx restarted."

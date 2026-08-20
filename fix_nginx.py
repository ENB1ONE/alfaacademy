import sys

conf_path = '/etc/nginx/sites-available/alfa-api'
with open(conf_path, 'r') as f:
    config = f.read()

# Remove the broken block
start_idx = config.find('location /api/analise/')
if start_idx != -1:
    end_idx = config.find('location / {', start_idx)
    config = config[:start_idx] + config[end_idx:]

block = """    location /api/analise/ {
        if ($request_method = 'OPTIONS') {
            add_header 'Access-Control-Allow-Origin' 'https://enb1one.github.io' always;
            add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
            add_header 'Access-Control-Allow-Headers' 'Authorization, Content-Type' always;
            add_header 'Access-Control-Allow-Credentials' 'true' always;
            add_header 'Content-Type' 'text/plain charset=UTF-8';
            add_header 'Content-Length' 0;
            return 204;
        }
        client_max_body_size 500M;
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
"""
config = config.replace('location / {', block + '    location / {')

with open(conf_path, 'w') as f:
    f.write(config)

print("Nginx config fixed.")

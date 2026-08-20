import sys

conf_path = '/etc/nginx/sites-available/alfa-api'
with open(conf_path, 'r') as f:
    config = f.read()

if 'location /api/analise/' not in config:
    block = '''
    location /api/analise/ {
        if ( = 'OPTIONS') {
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
        proxy_set_header Host System.Management.Automation.Internal.Host.InternalHost;
        proxy_set_header X-Real-IP ;
        proxy_set_header X-Forwarded-For ;
        proxy_set_header X-Forwarded-Proto ;
    }
'''
    config = config.replace('location / {', block + '\n    location / {')
    with open(conf_path, 'w') as f:
        f.write(config)
    print('Nginx config updated.')
else:
    print('Nginx config already has /api/analise/')

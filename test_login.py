import requests

try:
    res = requests.post("https://alfa-api.servicesbr.duckdns.org/api/auth/login", json={"usuario": "alfadmin", "senha": "alfa@123"})
    print(res.json())
except Exception as e:
    print(e)

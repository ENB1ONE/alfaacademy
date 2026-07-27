import requests

url = "https://alfa-api.servicesbr.duckdns.org/api/auth/login"
try:
    res = requests.post(url, json={"usuario": "alfadmin", "senha": "SenhaSegura123!"})
    print("Status:", res.status_code)
    print("Response:", res.text)
except Exception as e:
    print("Error:", e)

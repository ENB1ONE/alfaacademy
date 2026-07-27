with open("login.html", "r", encoding="utf-8") as f:
    content = f.read()

import re

new_style = """
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(rgba(10,10,12,0.85), rgba(10,10,12,0.6)), url('assets/img/alfa_mosaic_bg.png') center/cover no-repeat fixed;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            color: #fff;
        }
        .login-wrapper {
            background: rgba(18, 18, 20, 0.65);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            padding: 40px;
            border-radius: 16px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.5);
            width: 90%;
            max-width: 400px;
            border: 1px solid rgba(248, 193, 70, 0.2);
        }
"""
content = re.sub(r'<style>.*?\.login-wrapper {.*?}', new_style, content, flags=re.DOTALL)

with open("login.html", "w", encoding="utf-8") as f:
    f.write(content)

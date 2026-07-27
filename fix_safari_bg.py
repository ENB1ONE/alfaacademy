with open("crm/src/pages/Login.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# Fix for Safari iOS: removing 'fixed' which breaks background-size: cover
content = content.replace("url('/alfaacademy/assets/img/alfa_mosaic_bg.png') center/cover no-repeat fixed", "url('/alfaacademy/assets/img/alfa_mosaic_bg.png') center/cover no-repeat")
# Use 100dvh if possible for iOS Safari URL bar issue
content = content.replace("minHeight: '100vh'", "minHeight: '100dvh'")

with open("crm/src/pages/Login.jsx", "w", encoding="utf-8") as f:
    f.write(content)

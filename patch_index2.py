with open("index.html", "r", encoding="utf-8") as f:
    content = f.read()

import re

# Update .hero-sec CSS
hero_css = """section.hero-sec{
    background: linear-gradient(rgba(10,10,12,0.4), rgba(10,10,12,0.95)), url('assets/img/alfa_academy_hero.png') center/cover no-repeat fixed;
    padding:140px 0 90px;
    text-align:center;
    position:relative;
    overflow:hidden;
    border-bottom:1px solid var(--linha);
    min-height: 80vh;
    display: flex;
    align-items: center;
}"""
content = re.sub(r'section\.hero-sec\{.*?\}', hero_css, content, flags=re.DOTALL)

# Update h1 in hero to be even bigger and have shadows
h1_css = """
  .hero-sec h1{font-family:'Anton',sans-serif;font-size:clamp(3.5rem, 8vw, 6rem);letter-spacing:2px;text-transform:uppercase;color:var(--texto);line-height:1.1;margin-bottom:18px;text-shadow: 0 8px 25px rgba(0,0,0,0.8);}
"""
content = re.sub(r'\.hero-sec h1\{.*?\}', h1_css, content, flags=re.DOTALL)

# Add Glassmorphism to .comp-card and .cat-card
glass_css = """
  .comp-card{
      background:rgba(26,26,28,0.7);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border:1px solid rgba(248,193,70,0.15);
      border-radius:var(--radius);
      padding:28px;
      box-shadow:var(--sombra-card);
      display:flex;
      flex-direction:column;
      gap:18px;
      transition: all 0.3s;
  }
  .comp-card:hover {
      transform: translateY(-8px);
      border-color: rgba(248,193,70,0.5);
      box-shadow: 0 15px 30px rgba(0,0,0,0.6);
  }
"""
content = re.sub(r'\.comp-card\{.*?\}', glass_css, content, flags=re.DOTALL)

# Apply background to .comp-sec
comp_bg = """section.comp-sec{
    padding:100px 0;
    background: linear-gradient(rgba(20,20,22,0.85), rgba(20,20,22,0.95)), url('assets/img/alfa_training_bg.png') center/cover no-repeat fixed;
    border-top:1px solid var(--linha);
    border-bottom:1px solid var(--linha);
}"""
content = re.sub(r'section\.comp-sec\{.*?\}', comp_bg, content, flags=re.DOTALL)


with open("index.html", "w", encoding="utf-8") as f:
    f.write(content)

with open("index.html", "r", encoding="utf-8") as f:
    content = f.read()

import re

# 1. Update general CSS for modern look and animations
css_updates = """
  /* Animations */
  @keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  
  .hero{
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    background: linear-gradient(rgba(15,15,16,0.5), rgba(15,15,16,0.9)), url('assets/img/alfa_academy_hero.png') center/cover no-repeat fixed;
    padding: 0 20px;
    position: relative;
    overflow: hidden;
  }
  .hero::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; width: 100%; height: 100px;
    background: linear-gradient(to top, var(--preto) 0%, transparent 100%);
  }
  .hero-content {
    position: relative;
    z-index: 2;
    animation: fadeInUp 1s ease-out;
  }
  .hero h2{font-family:'Anton',sans-serif;font-size:clamp(3rem,8vw,5.5rem);text-transform:uppercase;color:var(--ouro);line-height:1;margin-bottom:20px;letter-spacing:2px;text-shadow: 0 5px 15px rgba(0,0,0,0.8);}
  .hero p{font-size:clamp(1.1rem,2vw,1.4rem);color:#E2DFD2;max-width:700px;margin:0 auto 30px;font-weight:400;text-shadow: 0 2px 5px rgba(0,0,0,0.8);}
  
  /* Buttons */
  .btn{
    display:inline-block;
    padding:16px 36px;
    background:var(--ouro);
    color:var(--preto);
    text-decoration:none;
    font-weight:700;
    font-size:1.1rem;
    border-radius:var(--radius);
    transition:all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border: none;
    cursor: pointer;
    box-shadow: var(--sombra-card);
  }
  .btn:hover{
    background:var(--ouro-2);
    transform:translateY(-3px);
    box-shadow: 0 8px 25px rgba(248, 193, 70, 0.4);
  }
  
  /* Metodologia Glassmorphism */
  .metodologia{
    padding:100px 20px;
    background: linear-gradient(rgba(20,20,22,0.85), rgba(20,20,22,0.95)), url('assets/img/alfa_training_bg.png') center/cover no-repeat fixed;
    text-align:center;
  }
  .met-grid{
    display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:30px;max-width:var(--maxw);margin:50px auto 0;
  }
  .met-card{
    background:rgba(20,20,22,0.5);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(248,193,70,0.15);
    padding:40px 30px;
    border-radius:var(--radius);
    transition:all 0.4s ease;
    box-shadow: var(--sombra-card);
  }
  .met-card:hover{
    transform:translateY(-10px);
    border-color: rgba(248,193,70,0.4);
    box-shadow: 0 15px 35px rgba(0,0,0,0.5), inset 0 0 20px rgba(248,193,70,0.05);
  }
"""

content = re.sub(r'\.hero\{.*?\.met-card:hover\{.*?\}', css_updates, content, flags=re.DOTALL)

# Update HTML Structure if needed
hero_html = """
<header class="header">
  <div class="header-inner">
    <div class="logo">Alfa<span>Academy</span></div>
    <nav class="nav">
      <a href="#sobre">Sobre</a>
      <a href="#metodologia">Metodologia</a>
      <a href="login.html" class="btn" style="padding:10px 20px; font-size:14px;">Portal do Aluno</a>
    </nav>
  </div>
</header>

<section class="hero">
  <div class="hero-content">
    <h2>Forjando Gigantes</h2>
    <p>O centro de treinamento de alto rendimento focado na evolução técnica, tática e humana. Do Sub-11 ao Sub-20, preparamos você para o futebol profissional.</p>
    <a href="#contato" class="btn">Agende sua Avaliação</a>
  </div>
</section>
"""

content = re.sub(r'<header class="header">.*?</section>', hero_html, content, flags=re.DOTALL)

with open("index.html", "w", encoding="utf-8") as f:
    f.write(content)

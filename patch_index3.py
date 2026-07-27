import re
with open("index.html", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add global background to body and update root variables if needed
body_css = """body{
  font-family:'Inter',system-ui,sans-serif;
  background: linear-gradient(rgba(10,10,12,0.88), rgba(10,10,12,0.92)), url('assets/img/alfa_mosaic_bg.png') center/cover no-repeat fixed;
  color:var(--texto);
  line-height:1.5;
  -webkit-font-smoothing:antialiased;
  min-height:100vh;
}"""
content = re.sub(r'body\{.*?\}', body_css, content, count=1, flags=re.DOTALL)

# 2. Make sections transparent with glassmorphism so the background shines through
# But keep them readable
def make_section_transparent(section_class):
    global content
    pattern = r'section\.' + section_class + r'\{.*?\}'
    match = re.search(pattern, content, flags=re.DOTALL)
    if match:
        old_css = match.group(0)
        # Remove any existing background and add transparent one
        new_css = re.sub(r'background:.*?;', '', old_css, flags=re.DOTALL)
        new_css = new_css.replace('}', ' background:rgba(20,20,22,0.4); backdrop-filter:blur(8px); -webkit-backdrop-filter:blur(8px); }')
        content = content.replace(old_css, new_css)

make_section_transparent('sobre-sec')
make_section_transparent('categorias-sec')
make_section_transparent('contato-sec')
make_section_transparent('area-restrita-sec')

# 3. For .comp-sec and .hero-sec, they have their own specific background logic.
# The user wants "igual temos no inicio e na competição". I'll leave hero and comp as they are, but make sure they don't break.
# Let's check hero-sec and ensure flex centering for desktop.
hero_flex = """section.hero-sec{
    background: linear-gradient(rgba(10,10,12,0.4), rgba(10,10,12,0.95)), url('assets/img/alfa_academy_hero.png') center/cover no-repeat fixed;
    padding:120px 20px;
    text-align:center;
    position:relative;
    overflow:hidden;
    border-bottom:1px solid var(--linha);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}"""
content = re.sub(r'section\.hero-sec\{.*?\}', hero_flex, content, flags=re.DOTALL)

# 4. Make sure container classes wrap correctly
# Ensure .wrap exists and works
content = content.replace('.sobre-grid{', '.sobre-grid{max-width:var(--maxw);margin:0 auto;')
content = content.replace('.categorias-grid{', '.categorias-grid{max-width:var(--maxw);margin:40px auto 0;')
content = content.replace('.comp-intro{', '.comp-intro{max-width:var(--maxw);margin:0 auto 40px;')
content = content.replace('.comp-grid{', '.comp-grid{max-width:var(--maxw);margin:0 auto;')
content = content.replace('.contato-grid{', '.contato-grid{max-width:var(--maxw);margin:0 auto;')

with open("index.html", "w", encoding="utf-8") as f:
    f.write(content)

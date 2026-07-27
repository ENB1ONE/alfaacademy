with open("crm/src/index.css", "r", encoding="utf-8") as f:
    css = f.read()

# Let's fix the invalid empty selector
# First, let's find the bad part
import re

css = re.sub(r'\}\s*\}\s*/\* Responsive Layout \*/', '} /* Responsive Layout */', css)
css = css.replace("  \n/* Responsive Layout */", "/* Responsive Layout */")

# Let's just restore the file up to line 98 roughly, or just find "Responsive Layout"
parts = css.split("/* Responsive Layout */")
base_css = parts[0]
if base_css.strip().endswith("}"):
    pass # ok
else:
    base_css += "}\n"

base_css = base_css.replace("}\n}\n", "}\n")

mobile_css = """
/* Responsive Layout */
@media (max-width: 768px) {
  .layout { flex-direction: column !important; }
  .mobile-header { display: flex !important; }
  .sidebar { 
    position: absolute; 
    top: 0; 
    left: -100%; 
    width: 100% !important; 
    height: 100%; 
    z-index: 999; 
    transition: left 0.3s ease; 
    border-right: none !important;
  }
  .sidebar.open {
    left: 0;
  }
  .main-content {
    padding: 20px !important;
    width: 100%;
  }
  /* Ocultar a logo de dentro da sidebar no mobile porque já tem no header */
  .sidebar > div:first-child {
    display: none !important;
  }
}
"""

with open("crm/src/index.css", "w", encoding="utf-8") as f:
    f.write(base_css + mobile_css)

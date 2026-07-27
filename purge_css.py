import re

with open("crm/src/index.css", "r", encoding="utf-8") as f:
    css = f.read()

# Let's remove ALL `@media` blocks entirely to ensure we clean out the garbage.
# This regex will match `@media (max-width: 768px) { ... }` properly by counting braces, or simply since we know the structure, we can just replace everything from the first @media to the end.
# Actually, the file is just one big CSS file.
# Let's find the first `@media (max-width: 768px)`
idx = css.find("@media (max-width: 768px)")
if idx != -1:
    css = css[:idx]

# Now append ONLY our clean responsive CSS
clean_mobile_css = """
@media (max-width: 768px) {
  .layout {
    flex-direction: column !important;
  }
  
  .mobile-header {
    display: flex !important;
  }
  
  .sidebar {
    position: fixed;
    top: 70px;
    left: -100%;
    width: 100% !important;
    height: calc(100vh - 70px);
    transition: left 0.3s ease;
    border-right: none;
    z-index: 999;
    background: var(--painel);
  }
  
  .sidebar.open {
    left: 0;
  }
  
  .main-content {
    padding: 20px !important;
    width: 100% !important;
  }
  
  .sidebar > div:first-child {
    display: none !important;
  }
  
  /* Reset link styles in sidebar for mobile */
  .sidebar nav {
    display: flex !important;
    flex-direction: column !important;
    flex-wrap: nowrap !important;
  }
  
  .sidebar a {
    flex: none !important;
    text-align: left !important;
    justify-content: flex-start !important;
  }
}
"""

with open("crm/src/index.css", "w", encoding="utf-8") as f:
    f.write(css.strip() + "\n\n" + clean_mobile_css)

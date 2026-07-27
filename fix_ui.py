with open("crm/src/pages/AttendanceHistory.jsx", "r", encoding="utf-8") as f:
    text = f.read()

import re

# Fix container width
text = text.replace("<div className=\"card\" style={{ padding: 20 }}>", "<div className=\"card\" style={{ padding: 20, maxWidth: 900, margin: '0 auto' }}>")

# Fix day cell styles
cell_style_find = """                style={{ 
                                    background: day ? 'rgba(255,255,255,0.02)' : 'transparent', 
                  borderRadius: 8,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: day ? 'pointer' : 'default',
                  border: isToday(day) ? '2px solid var(--ouro)' : '1px solid var(--linha)',
                  position: 'relative'
                }}"""

cell_style_replace = """                style={{
                  minHeight: 90,
                  padding: '10px 5px',
                  background: day ? 'rgba(255,255,255,0.03)' : 'transparent', 
                  borderRadius: 8,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  cursor: day ? 'pointer' : 'default',
                  border: day ? (isToday(day) ? '2px solid var(--ouro)' : '1px solid var(--linha)') : 'none',
                  position: 'relative'
                }}"""

text = text.replace(cell_style_find, cell_style_replace)

with open("crm/src/pages/AttendanceHistory.jsx", "w", encoding="utf-8") as f:
    f.write(text)

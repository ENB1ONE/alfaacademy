with open("crm/src/components/Layout.jsx", "r", encoding="utf-8") as f:
    text = f.read()

text = text.replace("icon={ClipboardCheck, BookOpen}", "icon={ClipboardCheck}")
text = text.replace("import { ClipboardCheck } from 'lucide-react';", "import { ClipboardCheck, BookOpen } from 'lucide-react';")

# Just in case import was grouped:
text = text.replace("ClipboardCheck, ", "ClipboardCheck, BookOpen, ")
# Remove duplicate BookOpen if it happened
text = text.replace("BookOpen, BookOpen", "BookOpen")

# Make sure icon={ClipboardCheck, BookOpen} is completely gone.
text = text.replace("{ClipboardCheck, BookOpen}", "{ClipboardCheck}")

with open("crm/src/components/Layout.jsx", "w", encoding="utf-8") as f:
    f.write(text)

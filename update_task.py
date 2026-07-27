with open("C:/Users/Eduardo/.gemini/antigravity/brain/1d039b17-103a-4281-8591-bbff3ca61df2/task.md", "r", encoding="utf-8") as f:
    text = f.read()

text = text.replace("- [ ] Drop the unique constraint `treinos_categoria_id_data_key` from PostgreSQL safely without losing data.", "- [x] Drop the unique constraint `treinos_categoria_id_data_key` from PostgreSQL safely without losing data.")
text = text.replace("- [ ] Add `tipo` column to `treinos`.", "- [x] Add `tipo` column to `treinos`.")

with open("C:/Users/Eduardo/.gemini/antigravity/brain/1d039b17-103a-4281-8591-bbff3ca61df2/task.md", "w", encoding="utf-8") as f:
    f.write(text)

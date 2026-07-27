BEGIN;

-- 1. Create activity logs
CREATE TABLE IF NOT EXISTS activity_logs (
    id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES treinadores(id) ON DELETE SET NULL,
    acao TEXT NOT NULL,
    detalhes JSONB,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Create Categorias table
CREATE TABLE IF NOT EXISTS categorias (
    id SERIAL PRIMARY KEY,
    nome TEXT UNIQUE NOT NULL,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Extract unique categories from current atletas and treinos to populate
INSERT INTO categorias (nome)
SELECT DISTINCT categoria FROM atletas
ON CONFLICT (nome) DO NOTHING;

INSERT INTO categorias (nome)
VALUES ('Sub-11'), ('Sub-13'), ('Sub-15'), ('Sub-17'), ('Sub-20')
ON CONFLICT (nome) DO NOTHING;

-- 3. Treinador <-> Categoria relationship
CREATE TABLE IF NOT EXISTS treinador_categoria (
    treinador_id INT NOT NULL REFERENCES treinadores(id) ON DELETE CASCADE,
    categoria_id INT NOT NULL REFERENCES categorias(id) ON DELETE CASCADE,
    PRIMARY KEY (treinador_id, categoria_id)
);

-- 4. Migrate Atletas to use categoria_id
ALTER TABLE atletas ADD COLUMN IF NOT EXISTS categoria_id INT REFERENCES categorias(id) ON DELETE SET NULL;
UPDATE atletas SET categoria_id = categorias.id FROM categorias WHERE atletas.categoria = categorias.nome;

-- Optional: Drop old constraints if they exist so we can drop the column safely
ALTER TABLE atletas DROP CONSTRAINT IF EXISTS chk_atletas_categoria;

-- Instead of dropping the text column immediately which might break frontend logic temporarily, 
-- we can keep the text column synced via trigger OR just leave it for now.
-- Actually, let's just make categoria_id the source of truth in backend.
-- We will just keep 'categoria' text column to avoid breaking SELECTs that expect it, 
-- but we will populate it from the frontend OR drop it and update the SQL queries.
-- Dropping it is cleaner.
ALTER TABLE atletas DROP COLUMN IF EXISTS categoria;

-- Same for treinos
ALTER TABLE treinos ADD COLUMN IF NOT EXISTS categoria_id INT REFERENCES categorias(id) ON DELETE CASCADE;
UPDATE treinos SET categoria_id = categorias.id FROM categorias WHERE treinos.categoria = categorias.nome;
ALTER TABLE treinos DROP CONSTRAINT IF EXISTS chk_treinos_categoria;
ALTER TABLE treinos DROP CONSTRAINT IF EXISTS treinos_categoria_data_key;
ALTER TABLE treinos ADD CONSTRAINT treinos_categoria_id_data_key UNIQUE (categoria_id, data);
ALTER TABLE treinos DROP COLUMN IF EXISTS categoria;

COMMIT;

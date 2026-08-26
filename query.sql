CREATE TABLE IF NOT EXISTS jogos (id SERIAL PRIMARY KEY, data_jogo DATE NOT NULL, adversario VARCHAR(100) NOT NULL, categoria VARCHAR(50) NOT NULL, resultado VARCHAR(50), observacoes TEXT);

const express = require("express");
const router = express.Router();
const { Pool } = require("pg");

const pool = new Pool({
    user: "alfa_user",
    host: "localhost",
    database: "alfa_db",
    password: "alfa123",
    port: 5432,
});

router.get("/jogos", async (req, res) => {
    try {
        const query = `
            SELECT id, data_br, data_jogo, adversario, categoria_nome 
            FROM jogos 
            WHERE data_jogo >= CURRENT_DATE 
            ORDER BY data_jogo ASC 
            LIMIT 5
        `;
        const { rows } = await pool.query(query);
        res.json(rows);
    } catch (e) {
        console.error("Erro na rota publica de jogos:", e);
        res.status(500).json({ error: "Erro ao buscar jogos" });
    }
});

module.exports = router;

const { Pool } = require('pg');
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'alfa_db',
    password: 'root', // I'll assume it's running via Docker or it's accessible locally on the OCI.
    port: 5432,
});

async function run() {
    try {
        await pool.query("ALTER TABLE treinadores ADD COLUMN foto TEXT");
        console.log("Column 'foto' added to treinadores table");
    } catch (e) {
        if (e.message.includes('already exists')) {
            console.log("Column 'foto' already exists");
        } else {
            console.error(e);
        }
    } finally {
        pool.end();
    }
}
run();

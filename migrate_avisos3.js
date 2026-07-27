const { Pool } = require('pg');
const pool = new Pool({ user: 'alfadmin', host: 'localhost', database: 'alfa_db', password: 'alfa@123', port: 5432 });

async function migrate() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS avisos (
                id SERIAL PRIMARY KEY,
                titulo VARCHAR(100) NOT NULL,
                descricao TEXT NOT NULL,
                tipo VARCHAR(20) DEFAULT 'Aviso',
                data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        
        const countRes = await pool.query('SELECT count(*) FROM avisos');
        if (parseInt(countRes.rows[0].count) === 0) {
            await pool.query(`
                INSERT INTO avisos (titulo, descricao, tipo) VALUES
                ('Inscrições Abertas Paulista Cup 2026', 'Divulgado pela comissão técnica central', 'Aviso'),
                ('Backup do Banco de Dados Concluído', 'Rotina automática no PostgreSQL', 'Servidor'),
                ('Avaliações Médicas Mensais', 'Agendadas para o próximo sábado', 'Aviso')
            `);
            console.log('Seed de avisos concluído');
        } else {
            console.log('Avisos já existem no banco.');
        }
    } catch(e) {
        console.error('Erro:', e);
    } finally {
        pool.end();
    }
}
migrate();

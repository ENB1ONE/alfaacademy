const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
    user: 'alfa_user',
    host: 'localhost',
    database: 'alfa_db',
    password: 'alfa123',
    port: 5432,
});

async function runSeed() {
    console.log('Iniciando seed de dados...');
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');
        
        // 1. Inserir Treinadores fictícios
        console.log('Inserindo treinadores...');
        const senhaHash = bcrypt.hashSync('alfa@123', 10);
        
        const treinadores = [
            { nome: 'Carlos Silva', user: 'carlos_silva', perfil: 'Treinador' },
            { nome: 'Mariana Souza', user: 'mariana_souza', perfil: 'Administrador' }
        ];
        
        for (let t of treinadores) {
            await client.query(
                `INSERT INTO treinadores (nome, usuario, usuario_lc, senha_hash, perfil, precisa_trocar_senha) 
                 VALUES ($1, $2, $3, $4, $5, false) ON CONFLICT DO NOTHING`,
                [t.nome, t.user, t.user.toLowerCase(), senhaHash, t.perfil]
            );
        }

        // 2. Inserir Atletas fictícios
        console.log('Inserindo atletas...');
        const nomes = ['João Pedro', 'Lucas Almeida', 'Mateus Costa', 'Felipe Santos', 'Gabriel Lima', 
                       'Rafael Pereira', 'Bruno Fernandes', 'Thiago Mendes', 'Pedro Henrique', 'Daniel Alves',
                       'Enzo Gabriel', 'Arthur Silva', 'Davi Lucca', 'Bernardo Sousa', 'Heitor Ribeiro',
                       'Samuel Gomes', 'Cauã Martins', 'Yuri Barbosa', 'Nicolas Carvalho', 'Pietro Rocha'];
        const categorias = ['Sub-11', 'Sub-13', 'Sub-15'];
        const posicoes = ['Atacante', 'Meia', 'Zagueiro', 'Goleiro', 'Lateral'];
        
        for (let i = 0; i < nomes.length; i++) {
            const cat = categorias[i % categorias.length];
            const pos = posicoes[i % posicoes.length];
            await client.query(
                `INSERT INTO atletas (nome, categoria, posicao, status_medico) 
                 VALUES ($1, $2, $3, 'Apto') ON CONFLICT DO NOTHING`,
                [nomes[i], cat, pos]
            );
        }

        // Selecionar um atleta para ficar lesionado
        await client.query(`UPDATE atletas SET status_medico = 'Lesionado' WHERE nome = 'João Pedro'`);

        // 3. Inserir Treinos e Presenças para hoje
        console.log('Inserindo treinos e presenças de hoje...');
        const dataHoje = new Date().toISOString().split('T')[0];
        
        for (let cat of categorias) {
            // Cria treino
            const treinoRes = await client.query(
                `INSERT INTO treinos (categoria, data, titulo) VALUES ($1, $2, 'Treino Seed') RETURNING id`,
                [cat, dataHoje]
            );
            const treinoId = treinoRes.rows[0].id;
            
            // Busca atletas da categoria
            const atletas = await client.query(`SELECT id, nome FROM atletas WHERE categoria = $1`, [cat]);
            
            // Registra presença aleatória
            for (let a of atletas.rows) {
                let status = 'P';
                if (Math.random() < 0.2) status = 'F'; // 20% de falta
                if (a.nome === 'João Pedro') status = 'J'; // O lesionado sempre justifica
                
                await client.query(
                    `INSERT INTO presencas (treino_id, atleta_id, status) VALUES ($1, $2, $3)
                     ON CONFLICT DO NOTHING`,
                    [treinoId, a.id, status]
                );
            }
        }

        await client.query('COMMIT');
        console.log('Seed de dados finalizado com sucesso!');
        
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Erro no seed:', error);
    } finally {
        client.release();
        process.exit();
    }
}

runSeed();

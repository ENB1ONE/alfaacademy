const origExit = process.exit;
process.exit = function(code) {
    console.log('process.exit called with code:', code);
    console.log(new Error().stack);
    origExit.call(process, code);
};

const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const chamadaRoutes = require('./routes/chamada');
const adminRoutes = require('./routes/admin');
const app = express();

app.use(cors({
    origin: 'https://enb1one.github.io',
    methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());

app.use('/api', authRoutes);
app.use('/api/chamada', chamadaRoutes);
app.use('/api/admin', adminRoutes);

app.listen(3000, '0.0.0.0', () => {
    console.log('Servidor rodando em 0.0.0.0:3000');
});
// Keep event loop alive explicitly
setInterval(() => {}, 60000);

const express = require('express');
const cors = require('cors');
const userRoutes = require('./src/routes/userRoutes');
const errorHandler = require("./src/middleware/erroHandler");


const app = express();
const PORT = 3001;

// permite a comunicação com o frontend local
app.use(cors({
    origin: [
        'http://localhost:5500',
        'http://127.0.0.1:5500'
    ]
}));

// permite receber json nas requests
app.use(express.json());

// disponibiliza as rotas de usuarios
app.use('/users', userRoutes);

// reposta para as rotas que não existe
app.use((req, res) => {
    res.status(404).json({
        error: 'Rota não encontada.'
    });
});

// Tratamento centralizado de erros
app.use(errorHandler)

// inicializa o servidor
app.listen(PORT, () => {
    console.log(`Servidor iniciado em http:localhost:${PORT}`);
});
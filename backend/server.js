const express = require('express');
const cors = require('cors');

const userRoutes = require('./src/routes/userRoutes');

const app = express();
const PORT = 3001;

// permite a comunicação com o frontend local
app.use(cors({
    origin: [
        'http://localhost:5500',
        'http://127.0.0.:5500'
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
app.use((error, req, res, next) => {
    console.error(error);
    
    if(error.type === 'entity.parse.failed'){
        return res.status(400).json({
            error: 'JSON inválido.'
        })
    }

    const status = error.status || 500;
    return res.status(status).json({
        error: status === 500 
        ? 'Internal server error.'
        : error.message
    });
})

// inicializa o servidor
app.listen(PORT, () => {
    console.log(`Servidor iniciado em http:localhost:${PORT}`);
});
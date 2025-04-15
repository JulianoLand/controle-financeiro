const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./config/database'); // Importa a conexão com o banco

const app = express();

const transactionRoutes = require('./routes/transactions');
const authRoutes = require('./routes/auth');

// Middlewares
app.use(cors());
app.use(express.json());

// Rota básica de teste
app.use('/auth', authRoutes);
app.use('/transactions', transactionRoutes);

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});

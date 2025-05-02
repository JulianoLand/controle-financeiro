const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./config/database'); // Importa a conexão com o banco

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  // methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  // allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // se for usar cookies/session no futuro
}));
// app.options('*', cors());
app.use(express.json());

const transactionRoutes = require('./routes/transactions');
const authRoutes = require('./routes/auth');
const shareRoutes = require('./routes/shareRoutes');

// Rota básica de teste
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/compartilhamento', shareRoutes);

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});

const express = require('express')
const cors = require('cors')
require('dotenv').config()
require('./config/database') // Importa a conexão com o banco

const app = express()

// Middlewares
app.use(cors())
app.use(express.json())

// Rota básica de teste
app.get('/', (req, res) => {
  res.send('🔥 API Controle Financeiro Rodando!')
})

// Inicia o servidor
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`)
})

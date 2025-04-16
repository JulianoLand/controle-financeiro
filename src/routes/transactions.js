const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { obterResumo, store, cloneFixMonth, show, update, del, relatorioAnual } = require('../controllers/transactionsController');

// Criar uma nova rota transação
router.post('/', authMiddleware, store);

// Lista por mes e ano
router.get('/', authMiddleware, cloneFixMonth);

// Relatório anual de receitas e depesas por mes
router.get('/relatorio/anual', authMiddleware,relatorioAnual);

router.get('/resumo', authMiddleware, obterResumo);

// Buscar uma transação por ID
router.get('/:id', authMiddleware, show);

// Atualizar uma transação
router.put('/:id', authMiddleware, update);

// Deletar uma transação
router.delete('/:id', authMiddleware, del);

module.exports = router;
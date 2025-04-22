const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { obterResumo, store, cloneFixMonth, show, update, del, relatorioAnual, index } = require('../controllers/transactionsController');
router.use(authMiddleware);

// GET /api/transacoes -> todas as transações (do usuário + compartilhadas)
router.get('/', index);

// GET /api/transacoes/resumo
router.get('/resumo', obterResumo);

// GET /api/transacoes/relatorio/anual
router.get('/relatorio/anual', relatorioAnual);

// GET /api/transacoes/fixas -> listagem de fixas de um mês
router.get('/fixas', cloneFixMonth);

// POST /api/transacoes
router.post('/', store);

// GET /api/transacoes/:id
router.get('/:id', show);

// PUT /api/transacoes/:id
router.put('/:id', update);

// DELETE /api/transacoes/:id
router.delete('/:id', del);

module.exports = router;
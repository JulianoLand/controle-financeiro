const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { obterResumo, store, cloneFixMonth, show, update, del, relatorioAnual } = require('../controllers/transactionsController');

// POST /api/transacoes
router.post('/', authMiddleware, store);

// GET /api/transacoes
router.get('/', authMiddleware, cloneFixMonth);

// GET /api/transacoes/relatorio/anual
router.get('/relatorio/anual', authMiddleware,relatorioAnual);

// GET /api/transacoes/resumo
router.get('/resumo', authMiddleware, obterResumo);

// GET /api/transacoes/:id
router.get('/:id', authMiddleware, show);

// PUT /api/transacoes/:id
router.put('/:id', authMiddleware, update);

// DELETE /api/transacoes/:id
router.delete('/:id', authMiddleware, del);

module.exports = router;
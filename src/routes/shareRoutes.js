const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { compartilharAcesso, listarCompartilhamentos } = require('../controllers/shareController');

// POST /api/compartilhamento/compartilhar
router.post('/compartilhar', auth, compartilharAcesso);

// GET /api/compartilhamento
router.get('/', auth, listarCompartilhamentos);

module.exports = router;
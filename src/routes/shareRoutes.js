const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { compartilharAcesso } = require('../controllers/shareController');

router.post('/compartilhar', auth, compartilharAcesso);

module.exports = router;
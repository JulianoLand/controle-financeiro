const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { register, login, deleteUser, getProfile } = require('../controllers/authController');

const router = express.Router();

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// DELETE /api/auth
router.delete('/', authMiddleware, deleteUser);

// GET /api/auth/me
router.get('/me', authMiddleware, getProfile);

module.exports = router;
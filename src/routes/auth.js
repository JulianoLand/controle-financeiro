const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const authLimiter = require('../middleware/rateLimit');

const { register, login, deleteUser, getProfile } = require('../controllers/authController');

// POST /api/auth/register
router.post('/register', authLimiter, register);

// POST /api/auth/login
router.post('/login', authLimiter, login);

// DELETE /api/auth
router.delete('/', authMiddleware, deleteUser);

// GET /api/auth/me
router.get('/me', authMiddleware, getProfile);

module.exports = router;
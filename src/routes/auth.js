const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
const SECRET = process.env.SECRET;

// Registro de usuário
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
            return res.status(400).json({ error: 'E-mail já cadastrado' });
        }

        const user = await User.create({ name, email, password });
        res.status(201).json({ message: 'Usuário criado', userId: user.id });
    } catch (e) {
        res.status(500).json({ error: 'Erro ao registrar usuário', details: e.message });
    }
});

// Login de usuário
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: '1h' });

        res.json({ message: 'Login bem-sucedido', token });
    } catch (e) {
        res.status(500).json({ error: 'Erro ao fazer login', details: e.message});
    }
});

// Deleta o usuário autenticado.
router.delete('/', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;

        // Deleta o usuário e transações associadas.
        await User.destroy({ where: { id: userId } });

        res.json({ message: 'Usuário deletado' });
    } catch (e) {
        console.error('Erro ao deletar usuário', e);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

module.exports = router;
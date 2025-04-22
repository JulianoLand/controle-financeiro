const User = require('../models/User');
const { authenticateUser } = require('../services/authService');

// Registro de usuário
async function register(req, res) {
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
}

// Login de usuário
async function login(req, res) {
    try {
        const { email, password } = req.body;

        const { token } = await authenticateUser(email, password);

        res.json({ message: 'Login bem-sucedido', token });
    } catch (e) {
        res.status(500).json({ error: 'Erro ao fazer login', details: e.message});
    }
}

// Deleta o usuário autenticado.
async function deleteUser(req, res) {
    try {
        const userId = req.user.id;

        // Deleta o usuário e transações associadas.
        await User.destroy({ where: { id: userId } });

        res.json({ message: 'Usuário deletado' });
    } catch (e) {
        console.error('Erro ao deletar usuário', e);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

//Retorna os dados do usuario autenticado
async function getProfile(req, res) {
    try {
        const user = await User.findByPk(req.userId, {
            attributes: ['name', 'email']
        });

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        res.json(user);
    } catch (e) {
        res.status(500).json({ error: 'Erro ao buscar perfil', details: e.message });
    }
}

module.exports = { register, login, deleteUser, getProfile };
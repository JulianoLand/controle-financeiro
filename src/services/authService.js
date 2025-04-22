const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/tokenUtils');
const User = require('../models/User');

// Lógica de login separada
async function authenticateUser(email, password) {
    const user = await User.findOne({ where: { email } });

    if (!user) {
        throw new Error('Credenciais inválidas');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        throw new Error('Credenciais inválidas');
    }

    const token = generateToken({ id: user.id });
    return { token };
}

module.exports = { authenticateUser };

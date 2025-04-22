const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET;

// Cria token com id (ou outros dados)
function generateToken(payload, expiresIn = '1h') {
    return jwt.sign(payload, SECRET, { expiresIn });
}

// Verifica e decodifica o token
function verifyToken(token) {
    return jwt.verify(token, SECRET);
}

module.exports = { generateToken, verifyToken };

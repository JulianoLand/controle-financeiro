const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET;

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(403).json({ error: 'Acesso negado. Token não fornecido' });
    }

    try {
        const user = jwt.verify(token, SECRET);
        req.user = user;
        
        next();
    } catch (e) {
        console.error(e);
        res.status(401).json({ error: 'Token inválido ou expirado' });
    }
};

module.exports = authMiddleware;
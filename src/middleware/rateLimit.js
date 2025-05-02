const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 10, // limita a 10 requisições por IP nesse intervalo
    message: {
        error: 'Muitas tentativas. Tente novamente em alguns minutos.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => req.method === 'OPTIONS',
});

module.exports = authLimiter;

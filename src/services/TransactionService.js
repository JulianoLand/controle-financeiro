const Transaction = require('../models/Transaction');
const { Op } = require('sequelize');
const clonarTransacoesFixas = require('../utils/clonarFixas');

async function listarPorMesEAno(userId, ano, mes) {
    try {
        const whereClause = { userId };

        if (ano && mes) {
            const inicio = new Date(`${ano}-${mes}-01 00:00:00`);
            const fim = new Date(inicio);
            fim.setMonth(fim.getMonth() + 1); // pega o primeiro dia do mes seguinte
            
            whereClause.date = {
                [Op.gte]: inicio,
                [Op.lt]: fim
            };

            await clonarTransacoesFixas(userId, ano, mes);
        }

        return await Transaction.findAll({
            where: whereClause,
            order: [['date', 'ASC']]
        });
    } catch (e) {
        console.error('erro ao listar transações: ', e);
    }

    
}

module.exports = { listarPorMesEAno };
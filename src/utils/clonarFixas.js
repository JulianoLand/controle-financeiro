const Transaction = require('../models/Transaction');
const { Op } = require('sequelize');

async function clonarTransacoesFixas(userId, ano, mes) {
    const inicioMes = new Date(`${ano}-${mes}-01 00:00:00`);
    const fimMes = new Date(inicioMes);
    fimMes.setMonth(fimMes.getMonth() + 1);

    // Verifica se já existe transações para esse mês
    const jaTem = await Transaction.findOne({
        where: {
            userId,
            fixa: true,
            date: {
                [Op.gte]: inicioMes,
                [Op.lt]: fimMes
            }
        }
    });

    if (jaTem) return;

    // Busca transações fixas do mes anterior
    const mesAnterior = new Date(inicioMes);
    mesAnterior.setMonth(mesAnterior.getMonth() - 1);
    const inicioAnterior = new Date(mesAnterior);
    const fimAnterior = new Date(inicioAnterior);
    fimAnterior.setMonth(fimAnterior.getMonth() + 1);

    const fixas = await Transaction.findAll({
        where: {
            userId,
            fixa: true,
            date: {
                [Op.gte]: inicioAnterior,
                [Op.lt]: fimAnterior
            }
        }
    });

    // Clonar pro mes atual
    const novas = fixas.map(tx => ({
        ...tx.toJSON(),
        id: undefined,
        createdAt: undefined,
        updatedAt: undefined,
        date: new Date(inicioMes), // ou usa a mesma data do original com mes ajustado
    }));

    await Transaction.bulkCreate(novas);
}

module.exports = clonarTransacoesFixas;
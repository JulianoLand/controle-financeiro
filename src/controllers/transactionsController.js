const Transaction = require('../models/Transaction');
const { Op } = require('sequelize');

async function obterResumo(req, res) {
    const userId = req.user.id;
    const { ano, mes } = req.query;

    if (!ano || !mes) {
        return res.status(400).json({ message: 'Ano e mês são obrigatórios'});
    }

    const inicioMes = new Date(`${ano}-${mes}-01`);
    const fimMes = new Date(inicioMes);
    fimMes.setMonth(fimMes.getMonth() + 1);

    try {
        const transacoes = await Transaction.findAll({
            where: {
                userId,
                date: {
                    [Op.gte]: inicioMes,
                    [Op.lt]: fimMes,
                },
            },
        });

        const totalReceitas = transacoes
            .filter(t => t.type === 'receita')
            .reduce((soma, t) => soma + parseFloat(t.amount), 0);

        const totalDespesas = transacoes
            .filter(t => t.type === 'despesa')
            .reduce((soma, t) => soma + parseFloat(t.amount), 0);

        const saldo = totalReceitas - totalDespesas;

        res.json({
            receitas: totalReceitas.toFixed(2),
            despesas: totalDespesas.toFixed(2),
            saldo: saldo.toFixed(2),
        });
    } catch (e) {
        console.error('Erro ao gerar resumo: ', e);
        res.status(500).json({ message: 'Erro ao gerar resumo' });
    }
}

module.exports = { obterResumo };
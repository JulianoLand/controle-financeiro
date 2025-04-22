const Transaction = require('../models/Transaction');
const { Op, fn, col } = require('sequelize');

const TransactionService = require('../services/TransactionService');

const SharedAccess = require('../models/SharedAccess');

async function obterResumo(req, res) {
    // const userId = req.user.id;
    const { ano, mes } = req.query;

    if (!ano || !mes) {
        return res.status(400).json({ message: 'Ano e mês são obrigatórios'});
    }

    const inicioMes = new Date(`${ano}-${mes}-01`);
    const fimMes = new Date(inicioMes);
    fimMes.setMonth(fimMes.getMonth() + 1);

    const compartilhadores = await SharedAccess.findAll({
        where: { sharedWithId: req.user.id },
        attributes: ['ownerId']
    });
    
    const idsCompartilhados = compartilhadores.map(c => c.ownerId);

    const todosOsIds = [req.user.id, ...idsCompartilhados];

    try {
        const transacoes = await Transaction.findAll({
            where: {
                userId: { [Op.in]: todosOsIds },
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

async function store (req, res) {
    try {
        const userId = req.user.id;
        const { type, title, amount, description, date, fixa } = req.body;

        if (!type || !amount || !date) {
            return res.status(400).json({ error: 'Campos obrigatórios faltando.' });
        }

        const transaction = await Transaction.create({ type, title, amount, description, date, fixa, userId });

        res.status(201).json(transaction);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Erro ao criar transação' });
    }
};

async function cloneFixMonth (req, res) {
    const { ano, mes } = req.query;

    try {
        const transacoes = await TransactionService.listarPorMesEAno(req.user.id, ano, mes);
        res.json(transacoes);
    } catch (e) {
        console.error('Erro ao buscar transações por mes: ', e);
        res.status(500).json({ error: 'Erro ao buscar transações' });
    }
};

async function show (req, res) {
    try {
        const transaction = await Transaction.findByPk(req.params.id);
        if (!transaction) return res.status(404).json({ error: 'Transação não encontrada'});
        res.json(transaction);
    } catch (e) {
        res.status(500).json({ error: 'Erro ao buscar transação', details: e.message });
    }
};

async function update (req, res) {
    console.log('Usuario autenticado: ', req.user);

    const { id } = req.params;
    const { type, title, amount, description, date, fixa, quitado } = req.body;

    try {
        const transaction = await Transaction.findOne({
            where: {
                id,
                userId: req.user.id
            }
        });

        if(!transaction) return res.status(404).json({ error: 'Transação não encontrada' });
        
        transaction.title = title ?? transaction.title;
        transaction.amount = amount ?? transaction.amount;
        transaction.description = description ?? transaction.description;
        transaction.type = type ?? transaction.type;
        transaction.date = date ?? transaction.date;
        transaction.fixa = fixa ?? transaction.fixa;
        transaction.quitado = quitado ?? transaction.quitado;

        await transaction.save();

        res.json({ message: 'Transação atualizada com sucesso!', transaction });
    } catch (e) {
        console.error('Erro ao atualizar!', e);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

async function del (req, res) {
    try {
        const userId = req.user.userId;
        const transactionId = req.params.id;

        const transaction = await Transaction.findOne({ where: {
            id: transactionId,
            userId: userId
            }
        });

        if (!transaction) return res.status(404).json({ error: 'Transação não encontrada'});

        await transaction.destroy();
        res.json({ message: 'Transação excluida com sucesso' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Erro ao deletar transação' });
    }
};

async function relatorioAnual (req, res) {
    const { ano } = req.query;

    if (!ano) {
        return res.status(400).json({ error: 'O ano é obrigatório para o relatorio' });
    }

    try {
        const relatorio = await Transaction.findAll({
            attributes: [
                [fn('MONTH', col('date')), 'mes'],
                'type',
                [fn('SUM', col('amount')), 'total']
            ],
            where: {
                userId: req.user.id,
                date: {
                    [Op.gte]: new Date(`${ano}-01-01 00:00:00`),
                    [Op.lt]: new Date(`${Number(ano) + 1}-01-01 00:00:00`)
                }
            },
            group: ['mes', 'type'],
            order: [['mes', 'ASC']]
        });

        // Inicializando estrutura com meses zerados
        const resultado = Array.from({ length: 12 }, (_, i) => ({
            mes: i + 1,
            receita: 0,
            despesa: 0
        }));

        // Preenche com os dados retornados do banco
        relatorio.forEach(item => {
            const mesIndex = item.dataValues.mes - 1;
            const tipo = item.dataValues.type;
            const total = parseFloat(item.dataValues.total);

            if (tipo === 'receita') resultado[mesIndex].receita = total;
            else if (tipo === 'despesa') resultado[mesIndex].despesa = total;
        });

        res.json(resultado);
    } catch (e) {
        console.error('Erro ao gerar relatorio', e);
        res.status(500).json({ error: 'Erro ao gerar relatório' });
    }
};

module.exports = { obterResumo, store, cloneFixMonth, show, update, del, relatorioAnual };
const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const authMiddleware = require('../middleware/authMiddleware');
const { obterResumo } = require('../controllers/transactionsController');

// Aplica a proteção a todas as rotas abaixo
// router.use(authMiddleware);

// Criar uma nova rota transação
router.post('/', authMiddleware, async (req, res) => {
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
});

// Lista por mes e ano
const clonarTransacoesFixas = require('../utils/clonarFixas');
router.get('/', authMiddleware, async (req, res) => {
    const { ano, mes } = req.query;

    try {
        let whereClause = { userId: req.user.id };

        if (ano && mes) {
            const inicio = new Date(`${ano}-${mes}-01 00:00:00`);
            const fim = new Date(inicio);
            fim.setMonth(fim.getMonth() + 1); // pega o primeiro dia do mes seguinte
            
            whereClause.date = {
                [require('sequelize').Op.gte]: inicio,
                [require('sequelize').Op.lt]: fim
            };

            await clonarTransacoesFixas(req.user.id, ano, mes);
            console.log('Datas do filtro estão sendo encaminhadas como: ', inicio, ' e ', fim);
        }


        const transacoes = await Transaction.findAll({
            where: whereClause,
            order: [['date', 'ASC']]
        });

        res.json(transacoes);
    } catch (e) {
        console.error('Erro ao buscar transações por mes: ', e);
        res.status(500).json({ error: 'Erro ao buscar transações' });
    }
});

// Buscar uma transação por ID
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const transaction = await Transaction.findByPk(req.params.id);
        if (!transaction) return res.status(404).json({ error: 'Transação não encontrada'});
        res.json(transaction);
    } catch (e) {
        res.status(500).json({ error: 'Erro ao buscar transação', details: e.message });
    }
});

// Atualizar uma transação
router.put('/:id', authMiddleware, async (req, res) => {
    console.log('Usuario autenticado: ', req.user);

    const { id } = req.params;
    const { type, title, amount, description, date } = req.body;

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

        await transaction.save();

        res.json({ message: 'Transação atualizada com sucesso!', transaction });
    } catch (e) {
        console.error('Erro ao atualizar!', e);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Deletar uma transação
router.delete('/:id', authMiddleware, async (req, res) => {
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
});

const { Op, fn, col } = require('sequelize');

// Relatório anual de receitas e depesas por mes
router.get('/relatorio/anual', authMiddleware, async (req, res) => {
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
});

router.get('/resumo', authMiddleware, obterResumo);

module.exports = router;
const sequelize = require('./src/config/database');
const Transaction = require('./src/models/Transaction');

async function test() {
    try {
        await sequelize.sync();
        const newTransaction = await Transaction.create({
            type: 'despesa',
            title: 'compras',
            amount: 350.56,
            description: 'Teste de despesa',
            date: new Date(),
            userId: 'id-do-usuario-teste'
        });

        console.log('transação criada', newTransaction.toJSON());

        const transactions = await Transaction.findAll();
        console.log('Lista de transações: ', transactions.map(t => t.toJSON()));
    } catch (e) {
        console.error('Erro ao testar banco: ', e);
    } finally {
        await sequelize.close();
    }
}

test();
const sequelize = require('../config/database');
const User = require('./User');
const Transaction = require('./Transaction');

async function syncDatabase() {
  try {
    await sequelize.sync({ alter: true });
    console.log('📦 Banco de dados sincronizado!');
  } catch (e) {
    console.error('Erro ao sicronizar com o banco de dados', e);
  }
}

syncDatabase();

module.exports = { User, Transaction };

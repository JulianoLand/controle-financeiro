require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'mariadb',
    logging: false, //não poluir o console com logs do SQL
    dialectOptions: {
        timezone: 'America/Sao_Paulo',
    },
      timezone: '-03:00', // Horário de Brasília
});

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('conectado ao banco de dados com sucesso');
    } catch (e) {
        console.error('Erro ao conectar com o banco de dados: ', e);
    }
}

testConnection();

module.exports = sequelize;
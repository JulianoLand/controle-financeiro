const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true
  },
  title: { // Adicionando o campo title
    type: DataTypes.STRING,
    allowNull: true
  },
  type: {
    type: DataTypes.ENUM('despesa', 'receita'),
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  fixa: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

Transaction.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
User.hasMany(Transaction, { foreignKey: 'userId' });

module.exports = Transaction;

const sequelize = require('../config/database');
const User = require('./User');
const Transaction = require('./Transaction');
const SharedAccess = require('./SharedAccess');

// Um usuário pode compartilhar com vários outros
User.hasMany(SharedAccess, {
  foreignKey: 'ownerId',
  as: 'sharedAccesses'
});

// Um usuário pode receber acesso de vários outros
User.hasMany(SharedAccess, {
  foreignKey: 'sharedWithId',
  as: 'receivedAccesses'
});

SharedAccess.belongsTo(User, {
    foreignKey: 'ownerId',
    as: 'owner',
});

SharedAccess.belongsTo(User, {
    foreignKey: 'sharedWithId',
    as: 'sharedWith',
});

module.exports = { User, sequelize, Transaction, SharedAccess };

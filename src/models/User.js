const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');
const SharedAccess = require('./SharedAccess');

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    hooks: {
      beforeCreate: async (user) => {
        user.password = await bcrypt.hash(user.password, 8);
      }
    }
  }
);

// Um usuário pode compartilhar com vários outros
User.hasMany(SharedAccess, {
  foreignKey: 'ownerId',
  as: 'compartilhados'
});

// Um usuário pode receber acesso de vários outros
User.hasMany(SharedAccess, {
  foreignKey: 'sharedWithId',
  as: 'acessosRecebidos'
});

module.exports = User;

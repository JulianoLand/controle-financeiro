'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Altera a coluna 'id' existente
    await queryInterface.changeColumn('SharedAccesses', 'id', {
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: Sequelize.literal('(UUID())'),
      primaryKey: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Reverte a alteração (ajuste conforme o estado anterior, se necessário)
    await queryInterface.changeColumn('SharedAccesses', 'id', {
      type: Sequelize.INTEGER, // ou outro tipo original
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    });
  }
};

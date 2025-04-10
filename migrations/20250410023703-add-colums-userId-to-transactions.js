'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Transactions', 'userId', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  async down (queryInterface) {
    await queryInterface.removeColumn('Transactions', 'userId');
  }
};

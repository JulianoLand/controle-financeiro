'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('SharedAccesses', 'canEdit', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('SharedAccesses', 'canEdit');
  }
};

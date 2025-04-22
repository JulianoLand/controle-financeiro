'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface) {
    const user1Id = uuidv4();
    const user2Id = uuidv4();

    await queryInterface.bulkInsert('users', [
      {
        id: user1Id,
        name: 'Alice',
        email: 'alice@email.com',
        password: 'hash_fake_1', // senha já hash
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: user2Id,
        name: 'Bob',
        email: 'bob@email.com',
        password: 'hash_fake_2',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);

    await queryInterface.bulkInsert('SharedAccesses', [
      {
        id: uuidv4(),
        ownerId: user1Id,
        sharedWithId: user2Id,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('SharedAccesses', null, {});
    await queryInterface.bulkDelete('users', null, {});
  }
};

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SharedAccess = sequelize.define('SharedAccess', {
    ownerId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    sharedWithId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    canEdit: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    tableName: 'shared_access',
    timestamps: true,
});

module.exports = SharedAccess;
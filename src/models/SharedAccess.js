const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SharedAccess = sequelize.define('SharedAccess', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
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
    tableName: 'SharedAccesses',
    timestamps: true,
});

module.exports = SharedAccess;
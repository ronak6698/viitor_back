const Sequelize = require('sequelize');
const db = require('../db');

const itemMaster = db.define('item_masters', {
    item_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    item_name: {
        type: Sequelize.STRING(),
    },
    item_price: {
        type: Sequelize.INTEGER,
    },
    is_delete: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    status: {
        type: Sequelize.STRING(15),
        defaultValue: 'active'
    },
});

module.exports = {
    itemMaster
}
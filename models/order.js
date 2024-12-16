const Sequelize = require('sequelize');

const sequelize = require('../utility/database');

const Order = sequelize.define('order', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    paymentId:Sequelize.STRING,
    orderId:Sequelize.STRING,
    status:{
        type:Sequelize.STRING,
        allowNull:false,
    }
});

module.exports = Order;
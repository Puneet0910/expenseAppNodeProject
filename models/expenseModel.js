const Sequelize = require('sequelize');

const sequelize = require('../utility/database');

const Expense = sequelize.define('expense', {
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true,
    },
    amount:{
        type:Sequelize.INTEGER,
        allowNull:false,
    },
    description:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    category:{
        type:Sequelize.STRING,
        allowNull:false,
    },
});

module.exports = Expense;
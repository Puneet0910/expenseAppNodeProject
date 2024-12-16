const Sequelize = require('sequelize');

const sequelize = require('../utility/database');

const User = sequelize.define('user', {
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true,
    },
    name:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    email:{
        type:Sequelize.STRING,
        allowNull:false,
        unique:true,
    },
    password:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    isPremium:{
        type:Sequelize.BOOLEAN,
        allowNull:false,
        defaultValue:false,
    },
});

module.exports = User;
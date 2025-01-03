const Sequelize = require("sequelize");
const sequelize = require("../utility/database");

//id, name , password, phone number, role

const ForgotPassword = sequelize.define("forgotpassword", {
  id: {
    type: Sequelize.UUID,
    allowNull: false,
    primaryKey: true,
  },
  active: Sequelize.BOOLEAN,
  expiresby: Sequelize.DATE,
});

module.exports = ForgotPassword;

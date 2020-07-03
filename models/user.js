const { Sequelize } = require("sequelize"); // mysql database related
const sequelize = require("../util/database");

const User = sequelize.define('user',{
  id:{
      type:Sequelize.INTEGER,
      autoIncrement:true,
      allowNull:false,
      primaryKey:true,
  },
  name:Sequelize.STRING,
  email:Sequelize.STRING,
  password:Sequelize.STRING
});

module.exports = User;
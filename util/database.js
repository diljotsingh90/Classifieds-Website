const Sequelize = require('sequelize').Sequelize;

const sequelize = new Sequelize("classifieds","root","admin",{
    dialect:'mysql',
    host:'localhost'
});
module.exports =sequelize;
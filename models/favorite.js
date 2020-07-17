const { Sequelize } = require("sequelize"); // mysql database related
const sequelize = require("../util/database");
const Post = require("./post");
const User = require("./user");

const Favorite = sequelize.define("favorite", {
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references:{
        model:User,
        key:"id"
    }
  },
  postId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references:{
        model:Post,
        key:"id"
    }
  },
});

module.exports = Favorite;

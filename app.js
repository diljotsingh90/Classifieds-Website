const express = require("express");
const app = express();
const path = require("path");

const { Sequelize } = require("sequelize"); // mysql database related
const sequelize = new Sequelize("classifieds", "root", "admin", {
  host: "localhost",
  dialect: "mysql",
});
sequelize
  .authenticate()
  .then(() => console.log("Connection has been established successfully."))
  .catch((error) => {
    console.log("Unable to connect to the database:", error);
    /* throw new Error(error); */
  });

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  res.render("error404");
});

app.use((error, req, res, next) => {
  res.render("error500");
});

app.listen(8000);

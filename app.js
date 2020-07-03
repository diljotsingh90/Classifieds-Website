const express = require("express");
const app = express();
const path = require("path");

const sequelize = require("./util/database");
const User =require("./models/user")



app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/post");

app.use("/auth", authRoutes);
app.use(postRoutes);

app.use((req, res, next) => {
  res.render("error404", {
    pageTitle: "Error 404",
  });
});

User

sequelize
  .authenticate()
  .then(() => console.log("Connection has been established successfully."))
  .catch((error) => {
    console.log("Unable to connect to the database:", error);
    /* throw new Error(error); */
  });
  sequelize
  .sync({force:true})
 // .sync()
  .then(()=>{
    app.listen(3000);
  })
  .catch(err => {
    
    console.log(err);
    throw err;
});

app.use((error, req, res, next) => {
  console.log(error);

  res.status(500).render("error500", {
    pageTitle: "Error 500",
  });
});
const express = require("express");
const app = express();
const path = require("path");
const bodyparser = require("body-parser");

const sequelize = require("./util/database");
const User = require("./models/user");

var session = require("express-session");
var MySQLStore = require("express-mysql-session")(session);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyparser.urlencoded({ extended: false }));

//session handling
var options = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "admin",
  database: "session_test",
  clearExpired: true,
  checkExpirationInterval: 900000,
  expiration: 86400000,
};

var sessionStore = new MySQLStore(options);

app.use(
  session({
    key: "session_cookie_name",
    secret: "session_cookie_secret",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
  })
);

app.use((req, res, next) => {
  // throw new Error('Sync Dummy');
  if (!req.session.user) {
    console.log("unknown yet");

    return next();
  }
  console.log(JSON.stringify(req.session));

  User.findByPk(req.session.user.id)
    .then((user) => {
      if (!user) {
        return next();
      }
      req.user = user;
      console.log(req.user);

      next();
    })
    .catch((err) => {
      next(new Error(err));
    });
});
// all routes
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/post");

app.use("/auth", authRoutes);
app.use(postRoutes);

app.use((req, res, next) => {
  res.render("error404", {
    pageTitle: "Error 404",
  });
});

User;

sequelize
  .authenticate()
  .then(() => console.log("Connection has been established successfully."))
  .catch((error) => {
    console.log("Unable to connect to the database:", error);
    /* throw new Error(error); */
  });

sequelize
  //  .sync({force:true})
  .sync()
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
    throw err;
  });

app.use((error, req, res, next) => {
  console.log(error);

  res.status(500).render("error500", {
    pageTitle: "Error 500",
  });
});

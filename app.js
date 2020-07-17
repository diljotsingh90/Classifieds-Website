const express = require("express");
const app = express();
const path = require("path");
const bodyparser = require("body-parser");
var randomstring = require("randomstring");
const sequelize = require("./util/database");

const csrf = require("csurf");
const User = require("./models/user");
const Post = require("./models/post");
const Favorite = require("./models/favorite");
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/post");

var session = require("express-session");
var MySQLStore = require("express-mysql-session")(session);
var multer = require("multer");

const csrfProtection = csrf();

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images");
  },
  filename: (req, file, cb) => {
    cb(null, randomstring.generate(7)+ "-" + file.originalname.trim());
  },
});
const fileFiltr = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  }
  else{
    cb(null,false);
  }
};
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFiltr }).array("imageUrl", 3)
);

//session handling
var options = {
  host: process.env.HOST,
  port: process.env.PORT,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
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
app.use(csrfProtection);
app.use((req, res, next) => {
  // throw new Error('Sync Dummy');
  if (!req.session.user) {
    console.log("unknown yet");

    return next();
  }
  /* console.log(JSON.stringify(req.session)); */

  User.findByPk(req.session.user.id)
    .then((user) => {
      if (!user) {
        return next();
      }
      req.user = user;
      /* console.log(req.user); */

      next();
    })
    .catch((err) => {
      next(new Error(err));
    });
});
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});
app.use("/auth", authRoutes);
app.use(postRoutes);

app.use((req, res, next) => {
  res.render("error404", {
    pageTitle: "Error 404",
    user: req.user,
  });
});

User;
Post;
User.hasMany(Post, {
  onDelete: "cascade",
});

Post.belongsTo(User);
Post.belongsToMany(User, {
  through: Favorite,
});
User.belongsToMany(Post, {
  through: Favorite,
});
sequelize
  .authenticate()
  .then(() => console.log("Connection has been established successfully."))
  .catch((error) => {
    console.log("Unable to connect to the database:", error);
    /* throw new Error(error); */
  });

sequelize
  // .sync({ force: true })
  .sync()
  .then(() => {
    app.listen(process.env.DB_PORT);
  })
  .catch((err) => {
    console.log(err);
    throw err;
  });

app.use((error, req, res, next) => {
  console.log(error);

  res.status(500).render("error500", {
    pageTitle: "Error 500",
    user: req.user,
  });
});

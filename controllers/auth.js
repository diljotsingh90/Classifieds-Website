const e = require("express");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

module.exports.getNewUser = (req, res, next) => {
  res.render("auth/signUp", {
    pageTitle: "SignUp",
    error: "",
    user: req.user,
  });
};
module.exports.postSignUp = async (req, res, next) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  let id;
  let idExists;
  const duplicateEmail = await User.findOne({
    where: { email: req.body.email },
  });
  if (duplicateEmail) {
    return res.render("auth/signUp", {
      pageTitle: "SignUp",
      error: "A user with this email already exists.",
      user: req.user,
    });
  }
  do {
    id = Math.random() * 1000000000;
    idExists = await User.findByPk(id);
  } while (idExists);
  const hashedpassword = await bcrypt.hash(password, 12);
  User.create({
    id: id,
    username: username,
    password: hashedpassword,
    email: email,
  })
    .then((result) => {
      return res.redirect("/");
    })
    .catch((err) => next(err));
};

module.exports.getLogin = (req, res, next) => {
  res.render("auth/logIn", {
    pageTitle: "Log In",
    error: "",
    errorPassword: "",
  });
};
module.exports.postLogin = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let id;
  let idExists;
  try {
    const user = await User.findOne({
      where: { email: req.body.email },
    });
    if (user === null) {
      return res.render("auth/logIn", {
        pageTitle: "Log In",
        error: "Incorrect Email",
        errorPassword: "",
        user: req.user,
      });
    } else {
      const isSame = await bcrypt.compare(password, user.password);
      if (isSame) {
        req.session.user = user;
        await req.session.save((err) => {
          console.log("Successful");
          return res.redirect("/");
        });
      } else {
        return res.render("auth/logIn", {
          pageTitle: "Log In",
          error: "",
          errorPassword: "Invalid Password. Please Try Again.",
          user: req.user,
        });
      }
    }
  } catch (err) {
    next(err);
  }
};

module.exports.logOut = (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect("/");
  });
};

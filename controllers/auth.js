const e = require("express");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const {OAuth2Client} = require('google-auth-library');

const client = new OAuth2Client(process.env.CLIENT_ID);
module.exports.getNewUser = (req, res, next) => {
  res.render("auth/signUp", {
    pageTitle: "SignUp",
    error: "",
    user: req.user,
  });
};
module.exports.postSignUp = async (req, res, next) => {
  try{
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const mobile = req.body.mobile;
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
    id = Math.floor(Math.random() * 1000000000);
    idExists = await User.findByPk(id);
  } while (idExists);
  const hashedpassword = await bcrypt.hash(password, 12);
  await User.create({
    id: id,
    username: username,
    password: hashedpassword,
    email: email,
    mobile: mobile,
  })
      return res.redirect("/auth/logIn");
    }
    catch(err){
      next(err);
    }
};

module.exports.getLogin = (req, res, next) => {
  res.render("auth/logIn", {
    pageTitle: "Log In",
    error: "",
    errorPassword: "",
  });
};
module.exports.postLogin = async (req, res, next) => {
 
  let id;
  let idExists;
  try {
    if(req.body.googleIdToken){
      const ticket = await client.verifyIdToken({
        idToken: req.body.googleIdToken,
        audience: process.env.CLIENT_ID,  
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    console.log(payload);
    let user = await User.findOne({
      where: { email: req.body.email },
    });
    if (user === null) {
      do {
        id = Math.floor(Math.random() * 1000000000);
        idExists = await User.findByPk(id);
      } while (idExists);
      user =User.create({
        id:id,
        email:req.body.email,
        username:req.body.username,
      });
      
    }
    req.session.user = user;
      await req.session.save((err) => {
        console.log("Successful");
        return res.redirect("/");
      });
    }
    else{
      const email = req.body.email;
      const password = req.body.password;
      const user = await User.findOne({
        where: { email: email },
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

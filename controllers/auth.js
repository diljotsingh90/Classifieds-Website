module.exports.getNewUser = (req, res, next) => {
  res.render("auth/signUp", {
    pageTitle: "SignUp",
  });
};

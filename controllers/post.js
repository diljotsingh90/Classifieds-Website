module.exports.listPosts = (req, res, next) => {
  res.render("unAuth/posts", {
    pageTitle: "Posts",
    user: req.user,
  });
};

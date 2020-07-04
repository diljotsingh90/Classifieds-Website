const Post = require("../models/post");
const User = require("../models/user");
const { request } = require("express");

module.exports.listPosts = async (req, res, next) => {
  const results = await Post.findAll({ include: User });
  const posts = results.map((result) => {
    return {
      id: result.dataValues.id,
      title: result.dataValues.title,
      category: result.dataValues.category,
      description: result.dataValues.description,
      location: result.dataValues.location,
      imageUrl: result.dataValues.imageUrl,
      price: result.dataValues.price,
      createdAt: Date(result.dataValues.createdAt),
      username: result.dataValues.user.username,
      mobile: result.dataValues.user.mobile,
    };
  });

  res.render("unAuth/posts", {
    pageTitle: "Home",
    user: req.user,
    posts: posts,
  });
};
module.exports.listMyPosts = async (req, res, next) => {
  if (typeof req.user === "undefined") {
    return res.redirect("/auth/logIn");
  }
  let results = await req.user.getPosts();
  /* const posts = results.map((result) => {
    return {
      id: result.dataValues.id,
      title: result.dataValues.title,
      category: result.dataValues.category,
      description: result.dataValues.description,
      location: result.dataValues.location,
      imageUrl: result.dataValues.imageUrl,
      price: result.dataValues.price,
      createdAt: Date(result.dataValues.createdAt),
      username: result.dataValues.user.username,
      mobile: result.dataValues.user.mobile,
    };
  }); */
  results = results.map((result) => {
    return result.dataValues;
  });

  res.render("unAuth/myPosts", {
    pageTitle: "User's Zone",
    user: req.user,
    posts: results,
  });
};
module.exports.getPost = async (req, res, next) => {
  let result = await Post.findByPk(req.params.postId, { include: User });
  result = {
    id: result.dataValues.id,
    title: result.dataValues.title,
    category: result.dataValues.category,
    description: result.dataValues.description,
    location: result.dataValues.location,
    imageUrl: result.dataValues.imageUrl,
    price: result.dataValues.price,
    createdAt: Date(result.dataValues.createdAt),
    username: result.dataValues.user.username,
  };
  /* 
  const posts = result.map((post) => {
    return { ...post.dataValues };
  });
  console.log(posts); */

  res.render("unAuth/onePost", {
    pageTitle: result.title,
    user: req.user,
    post: result,
  });
};
module.exports.getCreate = (req, res, next) => {
  if (typeof req.user === "undefined") {
    return res.redirect("/auth/logIn");
  }
  res.render("unAuth/createPost", {
    pageTitle: "Create Post",
    user: req.user,
    error: "",
  });
};

module.exports.postCreate = async (req, res, next) => {
  const title = req.body.title;
  const category = req.body.category;
  const description = req.body.description;
  const location = req.body.location;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  let id;
  let idExists;
  try {
    do {
      id = Math.floor(Math.random() * 1000000000);
      idExists = await Post.findByPk(id);
    } while (idExists);
    await req.user.createPost({
      id: id,
      title: title,
      category: category,
      price: price,
      description: description,
      location: location,
      imageUrl: imageUrl,
    });
    res.redirect("/");
  } catch (err) {
    next(err);
  }
};

module.exports.deletePost = async (req, res, next) => {
  const post = await Post.findByPk(req.params.postId);

  if (post.dataValues.userId == req.user.id) {
    await post.destroy();
  }
  res.redirect("/mine");
};

module.exports.getEditPost = async (req, res, next) => {
  if (typeof req.user === "undefined") {
    return res.redirect("/auth/logIn");
  }
  const post = await Post.findByPk(req.params.postId);

  if (post.dataValues.userId != req.user.id) {
    return res.redirect("/mine");
  }
  console.log(typeof post.dataValues.price);

  post.dataValues.price = post.dataValues.price.toString().trim();
  res.render("unAuth/createPost", {
    pageTitle: "Create Post",
    user: req.user,
    error: "",
    postData: {
      ...post.dataValues,
    },
  });
};

module.exports.postEditPost = async (req, res, next) => {
  const title = req.body.title;
  const category = req.body.category;
  const description = req.body.description;
  const location = req.body.location;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  let id;
  let idExists;
  try {
    if (typeof req.user === "undefined") {
      return res.redirect("/auth/logIn");
    }
    const post = await Post.findByPk(req.params.postId);
    if (post.dataValues.userId != req.user.id) {
      return res.redirect("/mine");
    }
    (post.title = title),
      (post.category = category),
      (post.price = price),
      (post.description = description),
      (post.location = location),
      (post.imageUrl = imageUrl),
      await post.save();
    res.redirect("/");
  } catch (err) {
    next(err);
  }
};

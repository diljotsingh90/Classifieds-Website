const Post = require("../models/post");
const User = require("../models/user");
const { request } = require("express");
const { Sequelize, where } = require("sequelize");
const dateFormat = require("dateformat");
const Favorite = require("../models/favorite");
const bcrypt = require("bcryptjs");
const Op = Sequelize.Op;
const fetch = require('node-fetch');
module.exports.listPosts = async (req, res, next) => {
  try {
    const results = await Post.findAll({ include: User });
    let userFavs;
    if (req.user != null) {
      userFavs = await Favorite.findAll({
        where: {
          userId: req.user.id,
        },
      });
    }
    const posts = results.map((result) => {
      let isfav = false;
      if (req.user != null) {
        userFavs.forEach((userFav) => {
          if (userFav.dataValues.postId === result.dataValues.id) {
            isfav = true;
          }
        });
      }
      result.dataValues.imageUrl = result.dataValues.imageUrl.split(
        " diljot6719diljot "
      );
      return {
        id: result.dataValues.id,
        title: result.dataValues.title,
        category: result.dataValues.category,
        description: result.dataValues.description,
        imageUrl: result.dataValues.imageUrl,
        price: result.dataValues.price,
        createdAt: Date(result.dataValues.createdAt),
        username: result.dataValues.user.username,
        mobile: result.dataValues.user.mobile,
        area: result.dataValues.area,
        isfav: isfav,
        country: result.dataValues.country,
        city: result.dataValues.city,
      };
    });
    res.render("unAuth/posts", {
      pageTitle: "Home",
      user: req.user,
      posts: posts,
    });
  } catch (err) {
    next(err);
  }
};
module.exports.listSearched = async (req, res, next) => {
  try {
    const word = req.body.word.trim();
    const results = await Post.findAll({
      include: User,
      where: {
        [Op.or]: [
          {
            title: {
              [Op.like]: "%" + word + "%",
            },
          },
          {
            category: {
              [Op.like]: "%" + word + "%",
            },
          },
          {
            area: {
              [Op.like]: "%" + word + "%",
            },
          },
          {
            city: {
              [Op.like]: "%" + word + "%",
            },
          },
        ],
      },
    });
    let userFavs;
    if (req.user != null) {
      userFavs = await Favorite.findAll({
        where: {
          userId: req.user.id,
        },
      });
    }
    const posts = results.map((result) => {
      let isfav = false;
      if (req.user != null) {
        userFavs.forEach((userFav) => {
          if (userFav.dataValues.postId === result.dataValues.id) {
            isfav = true;
          }
        });
      }
      result.dataValues.imageUrl = result.dataValues.imageUrl.split(
        " diljot6719diljot "
      );
      return {
        id: result.dataValues.id,
        title: result.dataValues.title,
        category: result.dataValues.category,
        description: result.dataValues.description,
        imageUrl: result.dataValues.imageUrl,
        price: result.dataValues.price,
        createdAt: Date(result.dataValues.createdAt),
        username: result.dataValues.user.username,
        mobile: result.dataValues.user.mobile,
        area: result.dataValues.area,
        isfav: isfav,
        country: result.dataValues.country,
        city: result.dataValues.city,
      };
    });
    res.render("unAuth/posts", {
      pageTitle: "Home",
      user: req.user,
      posts: posts,
      search: word,
    });
  } catch (err) {
    next(err);
  }
};
module.exports.changeCredentials = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.redirect("/auth/logIn");
    } else if (req.body.userId != req.user.id) {
      return res.redirect("/mine");
    } else {
      try {
        const user = await User.findByPk(req.user.id);
        user.username = req.body.username;
        if (req.body.password) {
          user.password = await bcrypt.hash(req.body.password, 12);
        }
        user.mobile = req.body.mobile;
        await user.save();
        return res.redirect("/mine");
      } catch (err) {
        next(err);
      }
    }
  } catch (err) {
    next(err);
  }
};
module.exports.addFavoritePost = async (req, res, next) => {
  if (typeof req.user === "undefined") {
    return res.redirect("/auth/logIn");
  }
  try {
    const alreadyHave = await Favorite.findOne({
      where: {
        [Op.and]: [
          {
            userId: req.user.id,
          },
          {
            postId: req.body.postId,
          },
        ],
      },
    });
    if (alreadyHave != null) {
      alreadyHave.destroy();
    } else {
      await Favorite.create({
        userId: req.user.id,
        postId: req.body.postId,
      });
    }
    res.status(201).send({
      message: "added successfully",
    });
    res.end();
  } catch (err) {
    next(err);
  }
};
module.exports.listMyPosts = async (req, res, next) => {
  if (typeof req.user === "undefined") {
    return res.redirect("/auth/logIn");
  }
  try {
    let results = await req.user.getPosts();
    results = results.map((result) => {
      result.dataValues.imageUrl = result.dataValues.imageUrl.split(
        " diljot6719diljot "
      );
      return result.dataValues;
    });
    res.render("unAuth/myPosts", {
      pageTitle: "User's Zone",
      user: req.user,
      posts: results,
      error: "",
    });
  } catch (err) {
    next(err);
  }
};
module.exports.listMyFavoritePosts = async (req, res, next) => {
  if (typeof req.user === "undefined") {
    return res.redirect("/auth/logIn");
  }
  try {
    let results = await Favorite.findAll({
      where: {
        userId: req.user.id,
      },
    });
    results = results.map((result) => {
      return result.dataValues.postId;
    });
    results = await Post.findAll({
      include: User,
      where: {
        id: results,
      },
    });
    const posts = results.map((result) => {
      result.dataValues.imageUrl = result.dataValues.imageUrl.split(
        " diljot6719diljot "
      );

      return {
        id: result.dataValues.id,
        title: result.dataValues.title,
        category: result.dataValues.category,
        description: result.dataValues.description,
        imageUrl: result.dataValues.imageUrl,
        price: result.dataValues.price,
        createdAt: Date(result.dataValues.createdAt),
        username: result.dataValues.user.username,
        mobile: result.dataValues.user.mobile,
        area: result.dataValues.area,
        isfav: true,
        country: result.dataValues.country,
        city: result.dataValues.city,
      };
    });
    res.render("unAuth/posts", {
      pageTitle: "My Favorites",
      user: req.user,
      posts: posts,
    });
  } catch (err) {
    next(err);
  }
};
module.exports.getPost = async (req, res, next) => {
  try {
    let result = await Post.findByPk(req.params.postId, { include: User });
    let isfav = false;
    if (req.user) {
      const favorite = await Favorite.findOne({
        where: {
          [Op.and]: [
            {
              userId: req.user.id,
            },
            {
              postId: req.params.postId,
            },
          ],
        },
      });
      if (favorite) {
        isfav = true;
      }
    }
    let resDate = result.dataValues.createdAt;
    //console.log(result.dataValues)
    resDate = dateFormat(resDate);

    result = {
      id: result.dataValues.id,
      title: result.dataValues.title,
      category: result.dataValues.category,
      description: result.dataValues.description,
      area: result.dataValues.area,
      country: result.dataValues.country,
      city: result.dataValues.city,
      state: result.dataValues.state,
      isfav: isfav,
      imageUrl: result.dataValues.imageUrl,
      price: result.dataValues.price,
      createdAt: resDate,
      username: result.dataValues.user.username,
    };
    result.imageUrl = result.imageUrl.split(" diljot6719diljot ");
    res.render("unAuth/onePost", {
      pageTitle: result.title,
      user: req.user,
      post: result,
    });
  } catch (err) {
    next(err);
  }
};
module.exports.getCreate = async (req, res, next) => {
  var result = await fetch(
    "https://www.universal-tutorial.com/api/getaccesstoken",
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "api-token":
          process.env.COUNTRY_GEN_TOKEN,
        "user-email": process.env.COUNTRY_GEN_EMAIL,
      },
    }
  );
  res.locals.citytoken= 
  (await result.json()).auth_token;
  console.log(res.locals.citytoken);
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
  try {
    const title = req.body.title;
    const category = req.body.category;
    const description = req.body.description;
    const area = req.body.area;
    const price = req.body.price;
    const city = req.body.city;
    const state = req.body.state;
    const country = req.body.country;
    let id;
    let idExists;
    let imageUrl = "";
    req.files.forEach((file) => {
      imageUrl += file.path + " diljot6719diljot ";
    });
    imageUrl.trim();

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
      area: area,
      imageUrl: imageUrl,
      city: city,
      state: state,
      country: country,
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
  var result = await fetch(
    "https://www.universal-tutorial.com/api/getaccesstoken",
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "api-token":
          process.env.COUNTRY_GEN_TOKEN,
        "user-email": process.env.COUNTRY_GEN_EMAIL,
      },
    }
  );
  res.locals.citytoken= (await result.json()).auth_token;
  if (typeof req.user === "undefined") {
    return res.redirect("/auth/logIn");
  }
  if (typeof req.user === "undefined") {
    return res.redirect("/auth/logIn");
  }
  try {
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
  } catch (err) {
    console.log(err);
  }
};

module.exports.postEditPost = async (req, res, next) => {
  const title = req.body.title;
  const category = req.body.category;
  const description = req.body.description;
  const area = req.body.area;
  const price = req.body.price;
  const city = req.body.city;
  const state = req.body.state;
  const country = req.body.country;
  let id;
  let idExists;
  try {
    if (typeof req.user === "undefined") {
      return res.redirect("/auth/logIn");
    }
    const post = await Post.findByPk(req.params.postId);
    if (!post || post.dataValues.userId != req.user.id) {
      return res.redirect("/mine");
    }
    (post.title = title),
      (post.category = category),
      (post.price = price),
      (post.description = description),
      (post.area = area),
      (post.city = city),
      (post.state = state),
      (post.country = country);
    if (req.files && req.files.length > 0) {
      let imageUrl = "";
      req.files.forEach((file) => {
        imageUrl += file.path + " diljot6719diljot ";
      });
      post.imageUrl = imageUrl;
    }
    await post.save();
    res.redirect("/mine");
  } catch (err) {
    next(err);
  }
};

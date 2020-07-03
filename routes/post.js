const router = require("express").Router();
const postController = require("../controllers/post");

router.get("/", postController.listPosts);

module.exports = router;

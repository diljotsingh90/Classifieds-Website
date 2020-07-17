const router = require("express").Router();
const postController = require("../controllers/post");

router.get("/", postController.listPosts);
router.post("/find", postController.listSearched);
router.post("/changecredentials", postController.changeCredentials);
router.get("/mine", postController.listMyPosts);
router.get("/favorites", postController.listMyFavoritePosts);
router.post("/addFavorite", postController.addFavoritePost);
router.get("/post/:postId", postController.getPost);
router.get("/create", postController.getCreate);
router.post("/create", postController.postCreate);

router.get("/edit/:postId", postController.getEditPost);
router.post("/edit/:postId", postController.postEditPost);
router.get("/delete/:postId", postController.deletePost);
module.exports = router;

const router = require("express").Router();
const authController = require("../controllers/auth");

router.get("/signUp", authController.getNewUser);
router.post("/signUp", authController.postSignUp);

router.get("/logIn", authController.getLogin);
router.post("/logIn", authController.postLogin);

router.use("/logOut", authController.logOut);
module.exports = router;

const router = require("express").Router();
const authController = require("../controllers/auth");

router.get("/newUser", authController.getNewUser);

module.exports = router;

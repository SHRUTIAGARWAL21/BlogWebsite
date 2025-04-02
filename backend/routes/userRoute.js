const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();

//register route
router.post("/register", userController.register);

//login route
router.post("/login", userController.login);

//logout route
router.post("/logout", userController.logout);

//profile route
router.get("/profile", userController.profile);

module.exports = router;

const express = require("express");
const router = express.Router();
const multer = require("multer");
const uploadMiddleware = multer({ dest: "./uploads" });
const postController = require("../controllers/postController");

//create post route
router.post(
  "/post",
  uploadMiddleware.single("files"),
  postController.createPost
);

//get post route
router.get("/post", postController.getPosts);

//update post route
router.put(
  "/post",
  uploadMiddleware.single("files"),
  postController.updatePosts
);

//get post by id
router.get("/post/:id", postController.getPostById);

//get post of user using userId
router.get("/:id", postController.getUserPost);

module.exports = router;

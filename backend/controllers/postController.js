const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Post = require("../models/Post");
const Like = require("../models/Like");
const Comments = require("../models/Comment");
const fs = require("fs");

const secret = "asbjigiuiyj mwelkj32u6983hef";

exports.createPost = async (req, res) => {
  const { originalname, path } = req.file;
  const parts = originalname.split(".");
  const ext = parts[parts.length - 1];
  const newPath = path + "." + ext;
  fs.renameSync(path, newPath);

  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const { title, summary, content } = req.body;

    const PostDoc = await Post.create({
      title,
      summary,
      content,
      cover: newPath,
      author: info.id,
      likes: 0,
    });

    res.json(PostDoc);
  });
};

exports.getPosts = async (req, res) => {
  const { token } = req.cookies;

  try {
    const posts = await Post.find()
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(20)
      .lean(); // Get plain JS objects for easier modification

    if (!token) {
      // User not logged in, just return posts with isLiked: false
      const postsWithLikeStatus = posts.map((post) => ({
        ...post,
        isLiked: false,
        likeCount: post.likeCount || 0,
        commentCount: post.commentCount || 0,
      }));
      return res.json(postsWithLikeStatus);
    }

    jwt.verify(token, secret, {}, async (err, user) => {
      if (err) {
        const postsWithLikeStatus = posts.map((post) => ({
          ...post,
          isLiked: false,
          likeCount: post.likeCount || 0,
          commentCount: post.commentCount || 0,
        }));
        return res.json(postsWithLikeStatus);
      }

      // Get post IDs and all likes by this user
      const postIds = posts.map((post) => post._id);
      const userLikes = await Like.find({
        user: user.id,
        post: { $in: postIds },
      });

      const likedPostIds = new Set(
        userLikes.map((like) => like.post.toString())
      );

      const postsWithLikeStatus = posts.map((post) => ({
        ...post,
        isLiked: likedPostIds.has(post._id.toString()),
        likeCount: post.likeCount || 0,
        commentCount: post.commentCount || 0,
      }));

      res.json(postsWithLikeStatus);
    });
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};

exports.updatePosts = async (req, res) => {
  let newPath = null;

  if (req.file) {
    const { id, originalname, path } = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    newPath = path + "." + ext;
    fs.renameSync(path, newPath);
  }

  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const { id, title, summary, content } = req.body;
    const postDoc = await Post.findById(id);
    const isAuthor = JSON.stringify(info.id) === JSON.stringify(postDoc.author);
    if (!isAuthor) {
      return res.status(400);
      throw "your are not the author";
    }
    if (newPath) {
      console.log(newPath);
    }
    postDoc.set({
      title,
      summary,
      content,
      cover: newPath ? newPath : postDoc.cover,
    });
    await postDoc.save();
    res.json(postDoc);
  });
};

exports.getPostById = async (req, res) => {
  const { id } = req.params;
  const { token } = req.cookies;

  try {
    const post = await Post.findById(id)
      .populate("author", ["username"])
      .lean();
    if (!post) return res.status(404).json({ error: "Post not found" });

    // Get likeCount
    const likeCount = await Like.countDocuments({ post: id });

    // Default values
    let isLiked = false;

    if (token) {
      try {
        const decoded = jwt.verify(token, secret);
        const userLike = await Like.findOne({ user: decoded.id, post: id });
        isLiked = !!userLike;
      } catch (err) {
        // Token invalid, leave isLiked as false
      }
    }

    const responsePost = {
      ...post,
      isLiked,
      likeCount,
    };

    res.json(responsePost);
  } catch (err) {
    console.error("Error fetching post by ID:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getUserPost = async (req, res) => {
  const { id } = req.params;
  try {
    const posts = await Post.find({ author: id }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error("Error fetching user posts:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.searchPosts = async (req, res) => {
  console.log(req.query);
  const term = req.query.q;
  const sanitizedTerm = term
    ? term.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, "\\$&")
    : "";

  console.log("search term", sanitizedTerm);

  try {
    const results = await Post.find({
      $or: [
        { title: { $regex: term, $options: "i" } },
        { content: { $regex: term, $options: "i" } },
        { summary: { $regex: term, $options: "i" } },
      ],
    });
    res.json(results);
  } catch (err) {
    //console.error("Search failed:", err.stack);
    res.status(500).json({ message: "Search failed", error: err.message });
  }
};

//handle like button
exports.handleLikeToggle = async (req, res) => {
  console.log(req.params);
  const { id } = req.params;
  const { token } = req.cookies;
  console.log(id);

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  jwt.verify(token, secret, {}, async (err, user) => {
    if (err) {
      throw err;
    }
    try {
      const post = await Post.findById(id);
      if (!post) return res.status(404).json({ error: "post not found" });

      const existingLike = await Like.findOne({
        user: user.id,
        post: id,
      });

      if (existingLike) {
        await Like.deleteOne({ _id: existingLike._id });
        post.likeCount -= 1;
        await post.save();
        return res.json({ isLiked: false, likeCount: post.likeCount });
      } else {
        await Like.create({ user: user.id, post: post._id });
        post.likeCount += 1;
        await post.save();
        return res.json({ isLiked: true, likeCount: post.likeCount });
      }
    } catch (err) {
      console.error("Toggle like error:", err);
      res.status(500).json({ error: "Something went wrong" });
    }
  });
};

// handle delete post
exports.deletePost = async (req, res) => {
  const { id } = req.params;
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  jwt.verify(token, secret, {}, async (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }

    try {
      const post = await Post.findById(id);
      if (!post) return res.status(404).json({ error: "Post not found" });

      // Check if the logged-in user is the author
      if (post.author.toString() !== user.id) {
        return res
          .status(403)
          .json({ error: "You are not allowed to delete this post" });
      }

      await Post.findByIdAndDelete(id);
      res.json({ success: true });
    } catch (err) {
      console.error("Error deleting post:", err);
      res.status(500).json({ error: "Server error" });
    }
  });
};

//get All comment
exports.getComments = async (req, res) => {
  console.log(req.params);
  const { id } = req.params;
  try {
    const comments = await Comments.find({ post: id })
      .populate("author", "username")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (err) {
    console.error("Error fetching comments : ", err);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
};

//handle comment
exports.hanleComment = async (req, res) => {
  const { id } = req.params;
  const { token } = req.cookies;
  const { content } = req.body;

  if (!token) {
    return res.status(401).json("not an authorized user");
  }

  jwt.verify(token, secret, {}, async (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }

    if (!content || content.trim() === "") {
      return res.status(400).json({ error: "comment content cannot be empty" });
    }
    try {
      const newComment = await Comments.create({
        post: id,
        author: user.id,
        content,
        createdAt: new Date(),
      });

      const populatedComment = await newComment.populate("author", "username");

      res.status(201).json(populatedComment);
    } catch (err) {
      console.error("Error saving comment:", err);
      res.status(500).json({ error: "Failed to save comment" });
    }
  });
};

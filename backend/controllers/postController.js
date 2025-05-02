const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Post = require("../models/Post");
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
    });

    res.json(PostDoc);
  });
};

exports.getPosts = async (req, res) => {
  res.json(
    await Post.find()
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(20)
  );
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
  const PostDoc = await Post.findById(id).populate("author", ["username"]);
  res.json(PostDoc);
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

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const getPostByUser = require("./postController");
const salt = bcrypt.genSaltSync(10);
const secret = "asbjigiuiyj mwelkj32u6983hef";

//register controller
exports.register = async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

//login controller
exports.login = async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });

  if (!userDoc) {
    return res.status(400).json("user not registered");
  }
  const passOk = bcrypt.compareSync(password, userDoc.password);

  if (passOk) {
    jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
      if (err) throw err;
      res.cookie("token", token).json({
        id: userDoc._id,
        username,
      });
    });
  } else {
    res.status(400).json("wrong credentials");
  }
};

//logout controller
exports.logout = (req, res) => {
  res.cookie("token", "").json("ok");
};

//profile controller
exports.profile = (req, res) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  jwt.verify(token, secret, {}, (err, info) => {
    if (err) throw err;
    // console.log(info);
    res.json(info);
  });
};

//get user info
exports.getUserById = (req, res) => {
  const { token } = req.cookies;
  const { id } = req.params;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  jwt.verify(token, secret, {}, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }

    if (decoded.id !== id) {
      return res
        .status(403)
        .json({ error: "Forbidden: You can only access your own data" });
    }

    try {
      const user = await User.findById(id).select("username");
      if (!user) {
        return res.status(404).json({ error: "user not found" });
      }

      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "server error" });
    }
  });
};

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/userRoute");
const postRoutes = require("./routes/postRoute");

const app = express();

//middleware
app.use(express.json());
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));

//use the route
app.use("/user", userRoutes);
app.use("/post", postRoutes);

module.exports = app;

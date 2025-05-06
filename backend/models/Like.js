const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const LikeSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

LikeSchema.index({ user: 1, post: 1 }, { unique: true });

const LikeModel = model("Like", LikeSchema);
module.exports = LikeModel;

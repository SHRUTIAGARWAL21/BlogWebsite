const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const PostSchema = new Schema(
  {
    title: String,
    summary: {
      type: String,
      validate: {
        validator: function (value) {
          return value.split(/\s+/).length <= 100; // Limits to 100 words
        },
        message: "Summary must be 100 words or less.",
      },
    },
    content: String,
    cover: String,
    author: { type: Schema.Types.ObjectId, ref: "User" },

    likeCount: {
      type: Number,
      default: 0,
    },
    commentCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const PostModel = model("Post", PostSchema);
module.exports = PostModel;

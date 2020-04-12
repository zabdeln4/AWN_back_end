const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const PostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    //required: true,
  },
  categoryName: {
    type: String,
  },
  numViews: {
    type: Number,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  status: {
    // what is its type? dont know its usage
    type: String,
    default: "active",
    //required: true,
  },
  tags: {
    type: String,
  },
});

module.exports = Post = mongoose.model("posts", PostSchema);

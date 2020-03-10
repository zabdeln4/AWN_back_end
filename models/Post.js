const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const PostSchema = new Schema({
  postID: {
    type: Schema.Types.ObjectId,
    required: true
  },
  status: {
    // what is its type?
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  tags: [{ type: String }],
  location: {
    type: String
  },
  numViews: {
    type: Number
  },
  numUsersOfferedHelp: {
    type: Number
  },
  date: {
    type: date,
    required: true
  },
  dueDate: {
    type: date,
    required: true
  },
  categoryID: {
    type: Schema.Types.ObjectId,
    ref: "categorys"
  }
});

module.exports = Post = mongoose.model("posts", PostSchema);

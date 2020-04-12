const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const PostSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId
  },
  regUserID: {
    type: Schema.Types.ObjectId,
    required: true
  },
  status: {
    // what is its type?
    //active or notactive
    type: String,
    default: "active"
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
    type: Number,
    default: 0
  },
  numUsersOfferedHelp: {
    type: Number,
    default: 0
  },
  date: {
    type: Date,
    default: Date.now
  },
  /*dueDate: {
    type: Date,
    required: true
  },*/
  categorytype: {
    //volunteer
    //donation
    //recycle
    type: String,
    required: true
  },
  reported: {
    type: Boolean,
    default: false
  }
});

module.exports = Post = mongoose.model("posts", PostSchema);

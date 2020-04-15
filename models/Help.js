const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const HelpSchema = new Schema({
  date: {
    type: Date,
    required: true,
  },
  helperID: {
    type: Schema.Types.ObjectId,
    ref: "registeredUsers",
  },
  recipientID: {
    type: Schema.Types.ObjectId,
    ref: "registeredUsers",
  },
  adminID: {
    type: Schema.Types.ObjectId,
    ref: "admins",
  },
  postID: {
    type: Schema.Types.ObjectId,
    ref: "posts",
  },
});

module.exports = Help = mongoose.model("helps", HelpSchema);

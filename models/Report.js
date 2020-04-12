const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ReportSchema = new Schema({
  reportFlag: {
    // what is the type
    type: Boolean,
    required: true,
  },
  adminID: {
    type: Schema.Types.ObjectId,
    ref: "admins",
  },
  reporterID: {
    type: Schema.Types.ObjectId,
    ref: "registeredUsers",
  },
  reportedUserID: {
    type: Schema.Types.ObjectId,
    ref: "registeredUsers",
  },
  postID: {
    type: Schema.Types.ObjectId,
    ref: "posts",
  },
});

module.exports = Report = mongoose.model("report", ReportSchema);

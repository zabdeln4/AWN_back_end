const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ReportSchema = new Schema({
  reportFlag: {
    // what is the type
    //User true
    //Post false
    type: Boolean,
    required: true
  },
  adminId: { type: Schema.Types.ObjectId, required: true },
  reporterID: {
    type: Schema.Types.ObjectId,
    required: true
  },
  reportedUserID: {
    type: Schema.Types.ObjectId
  },
  postID: {
    type: Schema.Types.ObjectId
  },
  description: {
    type: String,
    required: true
  }
});

module.exports = Report = mongoose.model("report", ReportSchema);

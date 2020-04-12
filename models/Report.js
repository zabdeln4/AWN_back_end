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
  adminID: {
    type: Schema.Types.ObjectId
  },
  reporterID: {
    type: Schema.Types.ObjectId
  },
  reportedUserID: {
    type: Schema.Types.ObjectId
  },
  postID: {
    type: Schema.Types.ObjectId
  }
});

module.exports = Report = mongoose.model("report", ReportSchema);

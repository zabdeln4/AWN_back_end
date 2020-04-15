const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const CategorySchema = new Schema({
  name: {
    // what is its type?
    type: String,
    required: true,
  },
  mainCategoryName: {
    // either Donation, Volunteering or Recycling
    type: String,
    required: true,
  },
});

module.exports = Category = mongoose.model("categorys", CategorySchema);

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  userID: {
    type: Schema.Types.ObjectId,
    required: true
  },
  name: {
    type: String,
    required: true
  } /*,
  avatar: {
    // to take profile picture from mail
    type: String
  }*/
});

const AdminSchema = new Schema({
  adminID: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  emain: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

const RegisteredUserSchema = new Schema({
  regUserID: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  phone: {
    type: String,
    required: true
  },
  emain: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  isBaaned: {
    type: Boolean,
    required: true
  },
  rate: {
    type: Number
  },
  postID: [
    // [] => means regUser has array of posts (relation 1:M)
    {
      type: Schema.Types.ObjectId,
      ref: "posts"
    }
  ],
  postLimit: {
    // regUser shall not exceed 4 posts per month
    type: Number
  }
});

module.exports = User = mongoose.model("users", UserSchema);

module.exports = Admin = mongoose.model("admins", AdminSchema);

module.exports = RegisteredUser = mongoose.model(
  "registeredUsers",
  RegisteredUserSchema
);

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
  }
  /*,
  avatar: {
    // to take profile picture from mail
    type: String
  }*/
});

const AdminSchema = new Schema({

  avatar: { type: String },
  name: {
    type: String,
    ref: "User"
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  adminName: {
    type: String,
    required: true,
    unique: true
  },
  isAdmin: {
    type: Boolean,
    default: true
  },
  numberofAssignedReport: {
    type: Number,
    default: 0
  }
});

const RegisteredUserSchema = new Schema({

  avatar: { type: String },
  userName: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    ref: "User"
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  isBaaned: {
    type: Boolean,
    default: false
  },
  rate: {
    type: Number,
    default: 5
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  postID: [
    // [] => means regUser has array of posts (relation 1:M)
    {
      type: Schema.Types.ObjectId
    }
  ],
  postLimit: {
    // regUser shall not exceed 4 posts per month
    type: Number,
    default: 0
  }
});

exports.User = mongoose.model("users", UserSchema);

exports.Admin = mongoose.model("admins", AdminSchema);

exports.RegisteredUser = mongoose.model("registeredUsers", RegisteredUserSchema);

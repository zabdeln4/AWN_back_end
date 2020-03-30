//npm i express mongoose passport passport-jwt jsonwebtoken body-parser bcryptjs validator
//npm i -D nodemon
// "start": "nodemon routes/server.js"
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

const users = require("./api/users");
const posts = require("./api/posts");
const profiles = require("./api/profiles");
const admins = require("./api/admins");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const db = require("../config/Keys").mongoURI;
mongoose.set("useCreateIndex", true);
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));
app.use("/api/posts", posts);
app.use("/api/profiles", profiles);
app.use("/api/users", users);
app.use("/api/admins", admins);

app.use(passport.initialize());
require("../config/passport")(passport);
// express doesn't consider not found 404 as an error so we need to handle 404 explicitly
// handle 404 error
app.use(function(req, res, next) {
  let err = new Error("Not Found");
  err.status = 404;
  next(err);
});
// handle errors
app.use(function(err, req, res, next) {
  console.log(err);

  if (err.status === 404) res.status(404).json({ message: "Not found" });
  else res.status(500).json({ message: "Something looks wrong :( !!!" });
});
const port = process.env.port || 5000;
app.listen(port, () => console.log(`server running on port = ${port}`));

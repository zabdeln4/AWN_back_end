const express = require("express");
const router = express.Router();
const User = require("../../models/User.js").RegisteredUser;
const Post = require("../../models/Post");
const isEmpty = require("../../validation/is-empty");
//volunteer
//donation
//recycle

//@access private
//desc post a post in the web site
//route
router.post("/postPost", (req, res) => {
  //something missing token check

  User.findOne(req.body.regUserID).then(user => {
    if (!user) {
      return res.status(404).json({ user: "User not found !!" });
    }
    const newPost = new Post({
      status: "active",
      regUserID: req.body.regUserID,
      title: req.body.title,

      tags: req.body.tags,
      location: req.body.location,
      categorytype: req.body.categorytype
    });
    newPost
      .save()
      .then(post => {
        res.json(post);
        //push post id to the user
        var postIDs = user.postID;
        postIDs.push(Post.id).catch(err => console.log(err));
        User.updateOne({ regUserID: req.body.regUserID }, { $set: postIDs }).catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  });
});
module.exports = router;

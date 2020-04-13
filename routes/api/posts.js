const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Post model
const Post = require("../../models/Post");
// Profile model
const Profile = require("../../models/Profile");
// Validation
const validatePostInput = require("../../validation/post");

// @route   GET api/posts/test
// @desc    Tests post route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Posts Works" }));

// @route   GET api/posts            ||  GET api/posts?page=..
// @desc    Get all posts if page=0  ||  paginate posts if page>=1
// @access  Public
router.get("/", (req, res) => {
  const page = parseInt(req.query.page);
  var limit, PostSkiped;
  // to return all posts set page=0
  if (page == 0) {
    limit = 0;
    PostSkiped = 0;
  } else {
    limit = 30; // posts per page = 30
    PostSkiped = (page - 1) * limit;
  }
  Post.find()
    .sort({ date: -1 })
    .skip(PostSkiped)
    .limit(limit)
    .then((posts) => res.json(posts))
    .catch((err) => res.status(404).json({ nopostsfound: "No posts found" }));
});

// @route   GET api/posts/all
// @desc    Get total number of posts
// @access  Public
router.get("/postNums", (req, res) => {
  Post.find()
    .then((posts) => res.json(posts.length))
    .catch((err) => res.status(404).json({ nopostsfound: "No posts found" }));
});

// @route   GET api/posts/:id
// @desc    Get post by its id
// @access  Public
router.get("/postid/:id", (req, res) => {
  Post.findById(req.params.id)
    .then((post) => res.json(post))
    .catch((err) =>
      res.status(404).json({ nopostfound: "No post found with that ID" })
    );
});

// @route   POST api/posts
// @desc    Create post
// @access  Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);
    // Check Validation
    if (!isValid) {
      // If any errors, send 400 with errors object
      return res.status(400).json(errors);
    }

    const newPost = new Post({
      user: req.user.id,
      title: req.body.title,
      description: req.body.description,
      tags: req.body.tags,
      location: req.body.location,
      categoryName: req.body.categoryName,
      status: req.body.status,
      dueDate: req.body.dueDate,
    });

    newPost.save().then((post) => res.json(post));
  }
);

// @route   DELETE api/posts/:id
// @desc    Delete post
// @access  Private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then((profile) => {
      Post.findById(req.params.id)
        .then((post) => {
          // Check for post owner
          if (post.user.toString() !== req.user.id) {
            return res
              .status(401)
              .json({ notauthorized: "User not authorized" });
          }
          //if not => Delete
          post.remove().then(() => res.json({ success: true }));
        })
        .catch((err) =>
          res.status(404).json({ postnotfound: "No post found" })
        );
    });
  }
);
/*
// @route   GET api/posts/:user
// @desc    Get all posts of a certen user by his ID
// @access  private
router.get(
  "/user/:user",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.find({ user: req.params.user })
      .sort({ date: -1 })
      .then((post) => res.json(post))
      .catch((err) => res.status(404).json({ nopostsfound: "No posts found" }));
  }
);
*/

// @route   GET api/posts/userallposts
// @desc    Get all post of the current user
// @access  private
router.get(
  "/currentUser",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.find({ user: req.user.id })
      .sort({ date: -1 })
      .then((post) => res.json(post))
      .catch((err) => res.status(404).json({ nopostsfound: "No posts found" }));
  }
);

module.exports = router;

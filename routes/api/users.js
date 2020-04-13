const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Keys = require("../../config/Keys");
const router = express.Router();
const passport = require("passport");
const User = require("../../models/User").RegisteredUser;
const isEmpty = require("../../validation/is-empty");
const gravatar = require("gravatar");
const validateRegisterUserInput = require("../../validation/register")
  .validateRegisterUserInput;
const validateLoginUserInput = require("../../validation/login")
  .validateLoginUserInput;

router.get("/test", (req, res) => res.json({ msg: "Users hahaah" }));

router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterUserInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.find(
    {
      $or: [
        { email: req.body.email },
        { phone: req.body.phone },
        { userName: req.body.userName },
      ],
    },
    function (err, doc) {
      if (!isEmpty(doc)) {
        for (let i = 0; i < doc.length; i++) {
          // max 3 iterates
          if (doc[i].email === req.body.email) {
            errors.email = "The Same Email Used before";
          }
          if (doc[i].phone === req.body.phone) {
            errors.phone = "The Same Phone Number Used before";
          }
          if (doc[i].userName === req.body.userName) {
            errors.userName = "The Same User Name Used before";
          }
        }

        return res.status(400).json(errors);
      }
      const avatar = gravatar.url(
        req.body.email,
        {
          s: "200",
          r: "pg",
          d: "mm",
        },
        true
      );
      const newuser = new User({
        name: req.body.name,
        userName: req.body.userName,
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone,
        avatar,
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newuser.password, salt, (err, hash) => {
          if (err) throw err;
          newuser.password = hash;
          newuser
            .save()
            .then((user) => res.json(user))
            .catch((err) => console.log(err));
        });
      });
    }
  );
});
router.post("/login", (req, res) => {
  var { logindata, errors, isValid } = validateLoginUserInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne(logindata).then((user) => {
    if (!user) {
      return res.status(404).json({ user: "User not found !!" });
    }
    bcrypt.compare(req.body.password, user.password).then((ismatch) => {
      if (ismatch) {
        const payload = { id: user.id, type: user.isAdmin };
        jwt.sign(
          payload,
          Keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({ user, success: true, token: "Bearer " + token });
          }
        );
      } else {
        return res.status(400).json({ password: "password incorrect" });
      }
    });
  });
});

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    });
  }
);

module.exports = router;

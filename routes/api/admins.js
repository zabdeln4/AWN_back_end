const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Keys = require("../../config/Keys");
const router = express.Router();
const passport = require("passport");
const Admin = require("../../models/User.js").Admin;
const User = require("../../models/User.js").RegisteredUser;
const Post = require("../../models/Post.js");
const Report = require("../../models/Report.js");
const isEmpty = require("../../validation/is-empty");
const gravatar = require("gravatar");
const validateRegisterAdminInput = require("../../validation/register")
  .validateRegisterAdminInput;
const validateLoginAdminInput = require("../../validation/login")
  .validateLoginAdminInput;

router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterAdminInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  Admin.find(
    {
      $or: [{ email: req.body.email }, { adminName: req.body.adminName }],
    },
    function (err, doc) {
      if (!isEmpty(doc)) {
        for (let i = 0; i < doc.length; i++) {
          // max 3 iterates
          if (doc[i].email === req.body.email) {
            errors.email = "The Same Email Used before";
          }

          if (doc[i].adminName === req.body.adminName) {
            errors.adminName = "The Same Admin Name Used before";
          }
        }

        return res.status(400).json(errors);
      }
      const avatar = gravatar.url(
        req.body.email,
        { s: "100", r: "x", d: "retro" },
        true
      );
      const newadmin = new Admin({
        name: req.body.name,
        adminName: req.body.adminName,
        email: req.body.email,
        password: req.body.password,
        avatar,
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newadmin.password, salt, (err, hash) => {
          if (err) throw err;
          newadmin.password = hash;
          newadmin
            .save()
            .then((admin) => res.json(admin))
            .catch((err) => console.log(err));
        });
      });
    }
  );
});
router.post("/login", (req, res) => {
  var { logindata, errors, isValid } = validateLoginAdminInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  Admin.findOne(logindata).then((admin) => {
    if (!admin) {
      return res.status(404).json({ admin: "Admin not found !!" });
    }

    bcrypt.compare(req.body.password, admin.password).then((ismatch) => {
      if (ismatch) {
        const payload = { id: admin.id, type: admin.isAdmin };
        jwt.sign(
          payload,
          Keys.secretOrKey,
          { expiresIn: 60 * 60 * 24 * 30 },
          (err, token) => {
            res.json({ success: true, token: "Bearer " + token });
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
    console.log(req.user);
    res.json(req.user);
  }
);

router.post(
  "/banUser",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //postId + reportId + token of admin

    Post.findById(req.body.postId)
      .then((data) => {
        var myquery = { _id: data.regUserID };
        var newvalues = { $set: { isBaaned: true } };

        User.updateOne(myquery, newvalues, function (err, affected) {
          if (err) {
            console.log("update document error");
            res.json(err);
          } else {
            var myquery = { _id: req.body.reportId };
            Report.findByIdAndDelete(myquery).then((doc) => {
              if (!doc) res.json({ err: "Report not found " });
              else {
                Admin.findOneAndUpdate(
                  { _id: req.user.id },
                  { $inc: { numberofAssignedReport: -1 } },
                  (a, b) => {}
                );
                res.json({
                  msg:
                    "Report removed successfully and User banned successfully",
                });
              }
            });
          }
        });
      })
      .catch((err) => console.log(err));
  }
);

router.post(
  "/removeReport",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // reportId + token of admin
    var myquery = { _id: req.body._id };

    Report.findByIdAndDelete(myquery)
      .then((doc) => {
        if (!doc) res.json({ err: "Report not found " });
        else {
          Admin.findOneAndUpdate(
            { _id: req.user.id },
            { $inc: { numberofAssignedReport: -1 } },
            (a, b) => {}
          );
          res.json({ msg: "Report removed successfully" });
        }
      })
      .catch((err) => res.json({ err: err }));
  }
);
router.post(
  "/viewReportedPosts",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Report.find({ adminId: req.user.id }, function (err, result) {
      if (err) {
        res.json(err);
      } else {
        res.json(result);
      }
      //console.log("haahahah");
    });
  }
);
module.exports = router;

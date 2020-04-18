const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Keys = require("../../config/Keys");
const router = express.Router();
const passport = require("passport");
const User = require("../../models/User.js").RegisteredUser;
const Report = require("../../models/Report");
const Admin = require("../../models/User.js").Admin;
const isEmpty = require("../../validation/is-empty");
const gravatar = require("gravatar");
const validateRegisterUserInput = require("../../validation/register").validateRegisterUserInput;
const validateLoginUserInput = require("../../validation/login").validateLoginUserInput;

router.get("/test", (req, res) => res.json({ msg: "Users hahaah" }));

router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterUserInput(req.body);
  if (!isValid) {
    return res.status(404).json(errors);
  }

  User.find(
    {
      $or: [{ email: req.body.email }, { phone: req.body.phone }, { userName: req.body.userName }],
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
            .then((user) => res.status(200).json(user))
            .catch((err) => res.json(err));
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
        jwt.sign(payload, Keys.secretOrKey, { expiresIn: 60 * 60 * 24 * 30 }, (err, token) => {
          var temp_user = {
            userName: user.userName,
            email: user.email,
            phoneNumber: user.phone,
            rate: user.rate,
            name: user.name,
          };
          user = temp_user;
          res.status(200).json({ user, success: true, token: "Bearer " + token });
        });
      } else {
        return res.status(404).json({ password: "password incorrect" });
      }
    });
  });
});

router.get("/userInfo/:id", (req, res) => {
  User.findById(req.params.id)
    .then((data) => {
      if (data) {
        return res.status(200).json({
          username: data.userName,
          Phonenumber: data.phone,
          rating: data.rate,
          email: data.email,
        });
      }
      return res.status(404).json({ msg: "User not found" });
    })
    .catch((err) => console.log(err));
});

router.post("/reportUser", passport.authenticate("jwt", { session: false }), (req, res) => {
  const newreportUser = new Report({
    reportFlag: true,
    reporterID: req.user.id,
    reportedUserID: req.body.reportedUserID,
    description: req.body.description,
  });
  newreportUser
    .save()
    .then((report) => res.json(report))
    .catch((err) => res.json(err));
  // res.json(req.data);
});

router.post("/reportPost", passport.authenticate("jwt", { session: false }), (req, res) => {
  //postId + Description + token of user
  //reportFlag false & reporterID req.user.id &
  //check if there is report with the same reporter at the same post
  Report.find(
    {
      $and: [{ reportFlag: false }, { reporterID: req.user.id }, { postID: req.body.postID }],
    },
    function (err, doc) {
      if (!isEmpty(doc)) {
        return res.status(400).json({ msg: "your report did not reviewd yet to the admin." });
      }
      //get the admin to assign report to .and then save thee report
      var admin = { numberofAssignedReport: 0 };
      Admin.find({}, (err, admins) => {
        if (admins.length == 0) {
          return res.status(400).json({ msg: "there is no admins in data base" });
        }

        for (var i = 0; i < admins.length; i++) {
          if (admins[i].numberofAssignedReport <= admin.numberofAssignedReport) {
            admin = admins[i];
          }
        }
        const newreportPost = new Report({
          adminId: admin.id,
          reportFlag: false,
          reporterID: req.user.id,
          postID: req.body.postID,
          description: req.body.description,
        });
        newreportPost
          .save()
          .then(() => {
            Admin.findOneAndUpdate({ _id: admin.id }, { $inc: { numberofAssignedReport: 1 } }, (a, b) => {});
            res.json({ msg: "reported successfully" });
          })
          .catch((err) => res.json(err));
      });
    }
  );
});
router.post("/reportPost3bdalla", (req, res) => {
  //postId + Description + id of user
  //reportFlag false & reporterID req.user.id &
  //check if there is report with the same reporter at the same post
  Report.find(
    {
      $and: [{ reportFlag: false }, { reporterID: req.body.id }, { postID: req.body.postID }],
    },
    function (err, doc) {
      if (!isEmpty(doc)) {
        return res.status(400).json({ msg: "your report did not reviewd yet to the admin." });
      }
      //get the admin to assign report to .and then save thee report
      var admin = { numberofAssignedReport: 0 };
      Admin.find({}, (err, admins) => {
        if (admins.length == 0) {
          return res.status(400).json({ msg: "there is no admins in data base" });
        }

        for (var i = 0; i < admins.length; i++) {
          if (admins[i].numberofAssignedReport <= admin.numberofAssignedReport) {
            admin = admins[i];
          }
        }
        const newreportPost = new Report({
          adminId: admin.id,
          reportFlag: false,
          reporterID: req.body.id,
          postID: req.body.postID,
          description: req.body.description,
        });
        newreportPost
          .save()
          .then(() => {
            Admin.findOneAndUpdate({ _id: admin.id }, { $inc: { numberofAssignedReport: 1 } }, (a, b) => {});
            res.json({ msg: "reported successfully" });
          })
          .catch((err) => res.json(err));
      });
    }
  );
});
module.exports = router;

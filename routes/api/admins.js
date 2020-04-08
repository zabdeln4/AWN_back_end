const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Keys = require("../../config/Keys");
const router = express.Router();
const passport = require("passport");
const Admin = require("../../models/User.js").Admin;
const isEmpty = require("../../validation/is-empty");

const validateRegisterAdminInput = require("../../validation/register").validateRegisterAdminInput;
const validateLoginAdminInput = require("../../validation/login").validateLoginAdminInput;

router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterAdminInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  Admin.find(
    {
      $or: [{ email: req.body.email }, { adminName: req.body.adminName }]
    },
    function(err, doc) {
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
      const newadmin = new Admin({
        name: req.body.name,
        adminName: req.body.adminName,
        email: req.body.email,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newadmin.password, salt, (err, hash) => {
          if (err) throw err;
          newadmin.password = hash;
          newadmin
            .save()
            .then(admin => res.json(admin))
            .catch(err => console.log(err));
        });
      });
    }
  );
});
router.post("/login", (req, res) => {
  let { logindata, errors, isValid } = validateLoginAdminInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  Admin.findOne(logindata[0]).then(admin => {
    if (!admin) {
      return res.status(404).json({ admin: "Admin not found !!" });
    }
    bcrypt.compare(logindata.password, admin.password).then(ismatch => {
      if (ismatch) {
        const payload = { id: admin.id, type: admin.isAdmin };
        jwt.sign(payload, Keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
          res.json({ success: true, token: "Bearer " + token });
        });
      } else {
        return res.status(400).json({ password: "password incorrect" });
      }
    });
  });
});

router.get("/current", passport.authenticate("jwt", { session: false }), (req, res) => {
  res.json({ name: req.admin.name });
});

module.exports = router;

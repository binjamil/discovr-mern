const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");

const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");

const Vendor = require("../models/vendor.model");

router.post("/login", (req, res) => {
  // Perform input validation
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const username = req.body.username;
  const password = req.body.password;

  Vendor.findOne({ username }).then(vendor => {
    // Check if vendor exists
    if (!vendor) {
      return res.status(404).json({ usernamenotfound: "Username not found" });
    }
    // Check password
    bcrypt.compare(password, vendor.password).then(isMatch => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: vendor._id,
          companyname: vendor.companyname
        };
        // Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 31556926 // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Password incorrect" });
      }
    });
  });
});

// Register a new vendor
router.route("/register").post((req, res) => {
  // Perform input validation
  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  // Check if email already exists
  Vendor.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    }
  });

  // Check if username already exists
  Vendor.findOne({ username: req.body.username }).then(user => {
    if (user) {
      return res.status(400).json({ username: "Username already exists" });
    } else {
      // If unique then create a new Vendor
      const newVendor = new Vendor({ ...req.body });

      // Hash password before saving in the database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newVendor.password, salt, (err, hash) => {
          if (err) throw err;
          newVendor.password = hash;
          newVendor
            .save()
            .then(() => res.json("Vendor added"))
            .catch(err => res.status(400).json("Error: " + err));
        });
      });
    }
  });
});

// Get vendor by username
router.route("/:username").get((req, res) => {
  Vendor.findOne({ username: req.params.username })
    .then(vendor => res.json(vendor))
    .catch(err => res.status(400).json("Error: " + err));
});

// Update an existing vendor
router.route("/:username").put((req, res) => {
  const vendor = req.body;
  const { ...updateDate } = vendor;
  Vendor.findOneAndUpdate(req.params.username, updateDate, { new: true })
    .then(() => res.json("Vendor updated"))
    .catch(err => res.status(400).json("Error: " + err));
});

// Get all reviews
router.route("/:username/review").get((req, res) => {
  Vendor.findOne({ username: req.params.username })
    .then(vendor => res.json(vendor.reviews))
    .catch(err => res.status(400).json("Error: " + err));
});

// Add a new review
router.route("/:username/review").post((req, res) => {
  const review = { ...req.body };
  Vendor.findOneAndUpdate(
    { username: req.params.username },
    { $push: { reviews: review } }
  )
    .then(() => res.json("Review added"))
    .catch(err => res.status(400).json("Error: " + err));
});

module.exports = router;

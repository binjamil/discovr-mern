const router = require("express").Router();
const Vendor = require("../models/vendor.model");

// Get vendor by username
router.route("/:username").get((req, res) => {
  Vendor.findOne({ username: req.params.username })
    .then(vendor => res.json(vendor))
    .catch(err => res.status(400).json("Error: " + err));
});

// Add a new vendor
router.route("/").post((req, res) => {
  const newVendor = new Vendor({ ...req.body });

  newVendor
    .save()
    .then(() => res.json("Vendor added"))
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

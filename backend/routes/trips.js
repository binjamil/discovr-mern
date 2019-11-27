const router = require("express").Router();
const Trip = require("../models/trip.model");

// Get all trips
router.route("/").get((req, res) => {
  Trip.find()
    .then(trips => res.json(trips))
    .catch(err => res.status(400).json("Error: " + err));
});

// Get all trips of a specific vendor username

// Get a single trip by id
router.route("/:id").get((req, res) => {
  Trip.findById(req.params.id)
    .then(trip => res.json(trip))
    .catch(err => res.status(400).json("Error: " + err));
});

// Delete a trip
router.route("/:id").delete((req, res) => {
  Trip.findByIdAndDelete(req.params.id)
    .then(() => res.json("Trip deleted"))
    .catch(err => res.status(400).json("Error: " + err));
});

// Add a new trip
router.route("/").post((req, res) => {
  const newTrip = new Trip({ ...req.body });

  newTrip
    .save()
    .then(() => res.json("Trip added"))
    .catch(err => res.status(400).json("Error: " + err));
});

// Update an existing trip
router.route("/:id").put((req, res) => {
  const trip = req.body;
  const { ...updateDate } = trip;
  Trip.findByIdAndUpdate(req.params.id, updateDate, { new: true })
    .then(() => res.json("Trip updated"))
    .catch(err => res.status(400).json("Error: " + err));
});

module.exports = router;

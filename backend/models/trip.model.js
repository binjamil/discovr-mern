const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tripSchema = new Schema(
  {
    username: String,
    title: String,
    date: Date,
    days: Number,
    location: {
      origin: String,
      destination: String
    },
    description: String,
    price: Number
  },
  {
    timestamps: true
  }
);

const Trip = mongoose.model("Trip", tripSchema);

module.exports = Trip;

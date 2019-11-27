const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const vendorSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    companyname: String,
    phone: String,
    reviews: [
      {
        username: String,
        stars: Number,
        comment: { type: String, default: "" },
        date: { type: Date, default: Date.now }
      }
    ]
  },
  {
    timestamps: true
  }
);

const Vendor = mongoose.model("Vendor", vendorSchema);

module.exports = Vendor;

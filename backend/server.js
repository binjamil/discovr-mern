const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

const tripsRouter = require("./routes/trips");
const vendorsRouter = require("./routes/vendors");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());

// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB connection established successfully.");
});

// Passport middleware
app.use(passport.initialize());

// Passport config
require("./config/passport")(passport);

// Routes
app.use("/trips", tripsRouter);
app.use("/vendors", vendorsRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

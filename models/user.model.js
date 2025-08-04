const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  id: Number,
  firstName: String,
  lastName: String,
  email: String,
  age: Number,
  gender: String,
  state: String,
  streetAddress: String,
  postalCode: String,
  city: String,
  country: String,
  latitude: Number,
  longitude: Number,
  trafficSource: String,

  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);

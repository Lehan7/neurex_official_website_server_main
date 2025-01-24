const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: [
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
      "Please provide a valid email address",
    ],
  },
  subscribedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Subscription", subscriptionSchema);

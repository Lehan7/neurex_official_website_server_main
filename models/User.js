const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  field: { type: String, required: true },
  message: { type: String, required: true },
  society: { type: String, required: true },
});

module.exports = mongoose.model("User", UserSchema);

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  googleId: { type: String },
  githubId: { type: String },
  name: { type: String, required: true }
});

module.exports = mongoose.model("User", UserSchema);

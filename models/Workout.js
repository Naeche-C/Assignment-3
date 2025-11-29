const mongoose = require("mongoose");

const WorkoutSchema = new mongoose.Schema({
  name: { type: String, required: true },
  duration: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Workout", WorkoutSchema);

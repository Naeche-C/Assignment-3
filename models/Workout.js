const mongoose = require('mongoose');

// Define the workout schema
const workoutSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  duration: { type: Number, required: true },
});

module.exports = mongoose.model('Workout', workoutSchema);
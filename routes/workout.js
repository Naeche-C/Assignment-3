const express = require("express");
const router = express.Router();
const Workout = require("../models/Workout");

// Middleware to protect routes
function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  return res.redirect("/");
}

// -----------------------------
// PUBLIC - View all workouts
// -----------------------------
router.get("/", async (req, res) => {
  const workouts = await Workout.find();
  res.render("workouts", { workouts });
});

// -----------------------------
// AUTH ONLY - Add Workout Form
// -----------------------------
router.get("/add", ensureAuth, (req, res) => {
  res.render("add-workout");
});

// -----------------------------
// AUTH ONLY - Create Workout
// -----------------------------
router.post("/", ensureAuth, async (req, res) => {
  await Workout.create(req.body);
  res.redirect("/workouts");
});

// -----------------------------
// AUTH ONLY - Edit Workout Form
// -----------------------------
router.get("/:id/edit", ensureAuth, async (req, res) => {
  const workout = await Workout.findById(req.params.id);
  if (!workout) return res.status(404).send("Workout not found");
  res.render("edit-workout", { workout });
});

// -----------------------------
// AUTH ONLY - Update Workout
// -----------------------------
router.put("/:id", ensureAuth, async (req, res) => {
  await Workout.findByIdAndUpdate(req.params.id, req.body);
  res.redirect("/workouts");
});

// -----------------------------
// AUTH ONLY - Delete Workout
// -----------------------------
router.delete("/:id", ensureAuth, async (req, res) => {
  await Workout.findByIdAndDelete(req.params.id);
  res.redirect("/workouts");
});

module.exports = router;

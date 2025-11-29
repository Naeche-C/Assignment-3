// ----------------------
// Required Packages
// ----------------------
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");

// Passport config
require("./config/passport")(passport);

// Initialize Express
const app = express();
const port = 3000;

// ----------------------
// View Engine
// ----------------------
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ----------------------
// Middleware
// ----------------------
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// ----------------------
// Session + Passport Setup
// ----------------------
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Make authenticated user available to views
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// ----------------------
// MongoDB Connection
// ----------------------
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB Error:", err));

// ----------------------
// Routes
// ----------------------

// Home Page
app.get("/", (req, res) => {
  res.render("home");
});

// Authentication routes (Google + GitHub)
app.use("/auth", require("./routes/auth"));

// Workout routes (ALL workout CRUD is inside routes/workout.js)
app.use("/workouts", require("./routes/workout"));

// Debug route to check login status (optional)
app.get("/debug", (req, res) => {
  res.send({
    loggedIn: req.isAuthenticated(),
    user: req.user,
  });
});

// ----------------------
// Server Start
// ----------------------
app.listen(port, () =>
  console.log(`Server running at http://localhost:${port}`)
);

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const Workout = require(path.join(__dirname, 'models', 'Workout'));

const app = express();
const port = 3000;

// Middleware
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log('MongoDB Error:', err));

// Home Page
app.get('/', (req, res) => {
    res.render('home');
});

// Show Edit Workout Page
app.get('/workouts/:id/edit', async (req, res) => {
  const workout = await Workout.findById(req.params.id);
  if (!workout) return res.status(404).send("Workout not found");
  res.render('edit-workout', { workout });
});


// View all workouts
app.get('/workouts', async (req, res) => {
    const workouts = await Workout.find();
    res.render('workouts', { workouts });
});

// Show form - Add Workout
app.get('/workouts/add', (req, res) => {
    res.render('add-workout');
});

// Create Workout
app.post('/workouts', async (req, res) => {
    await Workout.create(req.body);
    res.redirect('/workouts');
});

// Show form - Edit Workout
app.get('/workouts/:id/edit', async (req, res) => {
    const workout = await Workout.findById(req.params.id);
    res.render('edit-workout', { workout });
});

// Update Workout
app.put('/workouts/:id', async (req, res) => {
    await Workout.findByIdAndUpdate(req.params.id, req.body);
    res.redirect('/workouts');
});

// Delete Workout
app.delete('/workouts/:id', async (req, res) => {
    await Workout.findByIdAndDelete(req.params.id);
    res.redirect('/workouts');
});

// Server Start
app.listen(port, () => console.log(`Server running at http://localhost:${port}`));

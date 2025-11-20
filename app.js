// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Workout = require(path.join(__dirname, 'models', 'Workout'));
require('dotenv').config(); // For loading .env variables

// Debugging: Check if the model is loaded
console.log("Attempting to load Workout model...");

// Create the Express app
const app = express();
const port = 3000;

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Serve static files (like CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Parse incoming request bodies (for form submissions)
app.use(express.urlencoded({ extended: true }));

// MongoDB connection setup
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

// Routes

// Home page route (welcome message)
app.get('/', (req, res) => {
    res.render('home');  // This will render home.ejs
});

// Route to show the form for adding a new workout
app.get('/workouts/add', (req, res) => {
    res.render('add-workout');  // This will render add-workout.ejs
});

// Route to handle form submission and add new workout to the database
app.post('/workouts', (req, res) => {
    const { name, date, duration } = req.body;

    const newWorkout = new Workout({
        name: name,
        date: date,
        duration: duration
    });

    newWorkout.save()
        .then(() => {
            console.log("New workout added");
            res.redirect('/workouts');  // Redirect to workouts page after adding workout
        })
        .catch(err => {
            console.log("Error saving workout:", err);
            res.status(500).send("Error adding workout.");
        });
});

// Route to show all workouts
app.get('/workouts', (req, res) => {
    Workout.find()
        .then(workouts => {
            res.render('workouts', { workouts });  // This will render workouts.ejs
        })
        .catch(err => {
            console.log("Error fetching workouts:", err);
            res.status(500).send("Error fetching workouts.");
        });
});

// Route to show the form for editing a workout
app.get('/workouts/edit/:id', (req, res) => {
    const workoutId = req.params.id;
    Workout.findById(workoutId)
        .then(workout => {
            res.render('edit-workout', { workout });
        })
        .catch(err => {
            console.log("Error fetching workout for edit:", err);
            res.status(500).send("Error fetching workout for edit.");
        });
});

// Route to fetch all workouts
app.get('/workouts', (req, res) => {
  Workout.find()
    .then(workouts => {
      res.render('workouts', { workouts });  // Send all workouts to the workouts.ejs page
    })
    .catch(err => {
      console.log(err);
      res.status(500).send('Error fetching workouts');
    });
});

// Route to handle editing a workout
app.post('/workouts/edit/:id', (req, res) => {
    const workoutId = req.params.id;
    const { name, date, duration } = req.body;

    Workout.findByIdAndUpdate(workoutId, { name, date, duration })
        .then(() => {
            console.log("Workout updated");
            res.redirect('/workouts');  // Redirect to workouts page after update
        })
        .catch(err => {
            console.log("Error updating workout:", err);
            res.status(500).send("Error updating workout.");
        });
});

// Route to show the edit form for a specific workout
app.get('/workouts/edit/:id', (req, res) => {
  const workoutId = req.params.id;
  Workout.findById(workoutId)
    .then(workout => {
      res.render('edit-workout', { workout });
    })
    .catch(err => {
      console.log(err);
      res.status(500).send('Error fetching workout to edit');
    });
});

// Route to update a workout
app.post('/workouts/edit/:id', (req, res) => {
  const workoutId = req.params.id;
  const { name, date, duration } = req.body;  // Get form data

  Workout.findByIdAndUpdate(workoutId, { name, date, duration }, { new: true })
    .then(updatedWorkout => {
      res.redirect('/workouts');  // Redirect to the workouts page after update
    })
    .catch(err => {
      console.log(err);
      res.status(500).send('Error updating workout');
    });
});

// Route to delete a workout
app.post('/workouts/delete/:id', (req, res) => {
  const workoutId = req.params.id;

  Workout.findByIdAndDelete(workoutId)
    .then(() => {
      res.redirect('/workouts');  // Redirect to the workouts page after deletion
    })
    .catch(err => {
      console.log(err);
      res.status(500).send('Error deleting workout');
    });
});

// Delete route
app.post('/workouts/delete/:id', (req, res) => {
  const { id } = req.params;

  Workout.findByIdAndDelete(id, (err) => {
    if (err) {
      console.log('Error deleting workout:', err);
      res.redirect('/workouts');  // Redirect to the workouts page if an error occurs
    } else {
      res.redirect('/workouts');  // Redirect to the workouts page after successful deletion
    }
  });
});


// Route to handle deleting a workout
app.post('/workouts/delete/:id', (req, res) => {
    const workoutId = req.params.id;

    Workout.findByIdAndDelete(workoutId)
        .then(() => {
            console.log("Workout deleted");
            res.redirect('/workouts');  // Redirect to workouts page after delete
        })
        .catch(err => {
            console.log("Error deleting workout:", err);
            res.status(500).send("Error deleting workout.");
        });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../model/User');
const Goal = require('../model/Goal'); // Import the Goal model
const passport = require('passport');
const authenticate = require('../middleware/authenticate');


// Register Route
router.post('/register', async (req, res) => {
  const { email, username, password, gender, dob } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      username,
      password: hashedPassword,
      gender,
      dob
    });

    await newUser.save();

    // Create JWT Token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.status(200).json({ message: 'User registered successfully', token });
  } catch (err) {
    console.error('Registration Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log('Login request received:', { email, password }); // Debugging log

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found'); // Debugging log
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password does not match'); // Debugging log
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    console.log('Login successful:', { token, userId: user._id }); // Debugging log
    res.status(200).json({ message: 'Login successful', token, userId: user._id });
  } catch (err) {
    console.error('Login error:', err); // Debugging log
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/user/:id', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const goal = await Goal.findOne({ user: req.params.id });
    res.status(200).json({
      username: user.username,
      email: user.email,
      gender: user.gender,
      dob: user.dob,
      goal: goal?.goal || 'Not provided',
      currentWeight: goal?.currentWeight?.value || 'Not provided',
      goalWeight: goal?.goalWeight?.value || 'Not provided',
      height: goal?.height?.value || 'Not provided',
      activity: goal?.activity || 'Not provided',
      medicalIssues: goal?.medicalIssues || 'Not provided',
      foodPreferences: goal?.foodPreferences || 'Not provided',
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (err) {
    console.error('Error fetching user or goal:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update User Details Route
router.put('/user/:id', async (req, res) => {
  const { username, gender, dob } = req.body;

  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user details
    if (username) user.username = username;
    if (gender) user.gender = gender;
    if (dob) user.dob = dob;

    await user.save(); // Save the updated user details to the database

    res.status(200).json({ message: 'User details updated successfully', user });
  } catch (err) {
    console.error('Error updating user details:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Google Login Route
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// Google Callback Route
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/api/auth/google/unauthorized', session: false }),
  (req, res) => {
    if (!req.user) {
      return res.redirect('/api/auth/google/unauthorized');
    }
    const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });
    res.redirect(`http://localhost:3000/Loginhome?token=${token}&userId=${req.user._id}`);
  }
);

// Optional: Handle unauthorized users
router.get('/google/unauthorized', (req, res) => {
  res.redirect('http://localhost:3000/login?error=Email not registered');
});

module.exports = router;

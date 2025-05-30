// routes/goal.js
const express = require('express');
const router = express.Router();
const Goal = require('../model/Goal');
const User = require('../model/User'); // Import the User model
const authenticate = require('../middleware/authenticate');
const mongoose = require('mongoose');

router.post('/', authenticate, async (req, res) => {
  try {
    const {
      goal,
      currentWeight,
      goalWeight,
      height,
      age,
      activity,
      medicalIssues,
      foodPreferences
    } = req.body;

    const newGoal = new Goal({
      user: req.user,
      goal,
      currentWeight: { value: currentWeight, unit: 'kg' },
      goalWeight: { value: goalWeight, unit: 'kg' },
      height: { value: height, unit: 'cm' },
      age,
      activity,
      medicalIssues,
      foodPreferences
    });

    await newGoal.save();
    res.status(200).json({ message: 'Goal saved successfully' });
  } catch (err) {
    console.error('Error saving goal:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const goal = await Goal.findOne({ user: mongoose.Types.ObjectId(req.params.id) });
    if (!goal) return res.status(404).json({ message: "Goal not found" });

    res.json({
      currentWeight: goal.currentWeight?.value,
      goalWeight: goal.goalWeight?.value,
      height: goal.height?.value,
      activity: goal.activity,
      goal: goal.goal,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get('/user/:id', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const goal = await Goal.findOne({ user: new mongoose.Types.ObjectId(req.params.id) }); // Use 'new'
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

router.put('/:id', authenticate, async (req, res) => {
  const { goal, currentWeight, goalWeight, height, activity, medicalIssues, foodPreferences } = req.body;

  try {
    const userGoal = await Goal.findOne({ user: new mongoose.Types.ObjectId(req.params.id) }); // Use 'new'
    if (!userGoal) {
      return res.status(404).json({ message: 'Goal not found for this user' });
    }

    if (goal) userGoal.goal = goal;
    if (currentWeight) userGoal.currentWeight.value = currentWeight;
    if (goalWeight) userGoal.goalWeight.value = goalWeight;
    if (height) userGoal.height.value = height;
    if (activity) userGoal.activity = activity;
    if (medicalIssues) userGoal.medicalIssues = medicalIssues;
    if (foodPreferences) userGoal.foodPreferences = foodPreferences;

    await userGoal.save();

    res.status(200).json({ message: 'Goal updated successfully', goal: userGoal });
  } catch (err) {
    console.error('Error updating goal:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
router.put('/:id', authenticate, async (req, res) => {
  const { goal, currentWeight, goalWeight, height, activity, medicalIssues, foodPreferences } = req.body;

  try {
    // Ensure the user ID is correctly passed from the authenticate middleware
    const userId = req.params.id;

    // Find the goal document by user ID
    const userGoal = await Goal.findOne({ user: userId });
    if (!userGoal) {
      return res.status(404).json({ message: 'Goal not found for this user' });
    }

    // Update the goal fields
    if (goal) userGoal.goal = goal;
    if (currentWeight) userGoal.currentWeight.value = currentWeight;
    if (goalWeight) userGoal.goalWeight.value = goalWeight;
    if (height) userGoal.height.value = height;
    if (activity) userGoal.activity = activity;
    if (medicalIssues) userGoal.medicalIssues = medicalIssues;
    if (foodPreferences) userGoal.foodPreferences = foodPreferences;

    // Save the updated goal to the database
    await userGoal.save();

    res.status(200).json({ message: 'Goal updated successfully', goal: userGoal });
  } catch (err) {
    console.error('Error updating goal:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

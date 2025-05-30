// routes/foodHistory.js
const express = require('express');
const mongoose = require('mongoose');
const FoodHistory = require('../model/FoodHistory'); // Correctly import the model
const router = express.Router();
const axios = require('axios');
const multer = require('multer');
const path = require('path');

// Helper function to parse numeric values or handle ranges
const parseNumericValue = (value) => {
  if (typeof value === 'string' && value.includes('-')) {
    // Handle ranges like "250-450" by taking the average
    const [min, max] = value.split('-').map(Number);
    return (min + max) / 2;
  }
  return Number(value); // Convert to a number
};

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
  },
});

const upload = multer({ storage });

// Route to store food history
router.post('/add', async (req, res) => {
  const {
    userId,
    foodName,
    calories,
    protein,
    carbohydrates,
    fat,
    fiber,
    sugar,
    sodium,
    cholesterol,
    explanation,
  } = req.body;

  try {
    // Parse numeric fields
    const newFoodHistory = new FoodHistory({
      userId,
      foodName,
      calories: parseNumericValue(calories),
      protein: parseNumericValue(protein),
      carbohydrates: parseNumericValue(carbohydrates),
      fat: parseNumericValue(fat),
      fiber: parseNumericValue(fiber),
      sugar: parseNumericValue(sugar),
      sodium: parseNumericValue(sodium),
      cholesterol: parseNumericValue(cholesterol),
      explanation,
    });

    await newFoodHistory.save();

    res.status(201).json({ message: 'Food history added successfully' });
  } catch (error) {
    console.error('Error adding food history:', error);
    res.status(500).json({ error: 'Failed to store food history', details: error.message });
  }
});

// Route to save food history with image
router.post('/add-with-image', upload.single('image'), async (req, res) => {
  const {
    userId,
    foodName,
    calories,
    protein,
    carbohydrates,
    fat,
    fiber,
    sugar,
    sodium,
    cholesterol,
    explanation,
  } = req.body;

  try {
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null; // Save image URL if uploaded

    const newFoodHistory = new FoodHistory({
      userId,
      foodName,
      calories: parseNumericValue(calories),
      protein: parseNumericValue(protein),
      carbohydrates: parseNumericValue(carbohydrates),
      fat: parseNumericValue(fat),
      fiber: parseNumericValue(fiber),
      sugar: parseNumericValue(sugar),
      sodium: parseNumericValue(sodium),
      cholesterol: parseNumericValue(cholesterol),
      explanation,
      imageUrl, // Save the image URL
    });

    await newFoodHistory.save();

    res.status(201).json({ message: 'Food history with image added successfully', foodHistory: newFoodHistory });
  } catch (error) {
    console.error('Error adding food history with image:', error);
    res.status(500).json({ error: 'Failed to store food history with image', details: error.message });
  }
});

// Route to fetch food history
router.get('/', async (req, res) => {
  const { userId, date } = req.query;

  console.log('Query Parameters:', { userId, date }); // Debug incoming query parameters

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid userId' });
  }

  try {
    const startOfDay = new Date(`${date}T00:00:00`);
    const endOfDay = new Date(`${date}T23:59:59.999`);

    console.log('Start of Day (UTC):', startOfDay);
    console.log('End of Day (UTC):', endOfDay);

    const foodItems = await FoodHistory.find({
      userId: new mongoose.Types.ObjectId(userId),
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    console.log('Food Items:', foodItems); // Debug the query result
    res.status(200).json(foodItems);
  } catch (error) {
    console.error('Error fetching food history:', error);
    res.status(500).json({ error: 'Failed to fetch food history' });
  }
});

// Function to fetch food items
const fetchFoodItems = async (date) => {
  if (!date) return;
  const userId = localStorage.getItem('userId'); // Retrieve userId from localStorage
  console.log('User ID:', userId); // Debug userId

  if (!userId) {
    console.error('User ID not found in localStorage');
    return;
  }

  try {
    const formattedDate = date.toISOString().split('T')[0]; // Format date as yyyy-mm-dd
    const response = await axios.get(`http://localhost:8000/api/food-history?userId=${userId}&date=${formattedDate}`);
    setFoodItems(response.data);
  } catch (error) {
    console.error('Error fetching food items:', error);
  }
};

// Delete a food history item by ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await FoodHistory.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Food item not found' });
      console.log("Deleting ID:", req.params.id);
    }
    res.json({ message: 'Food item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete food item' });
  }
});

module.exports = router;

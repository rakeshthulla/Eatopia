// models/FoodHistory.js
const mongoose = require('mongoose');


// Define the schema for food history
const foodHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User model
  foodName: { type: String, required: true },
  calories: { type: Number, required: true },
  protein: { type: Number },
  carbohydrates: { type: Number },
  fat: { type: Number },
  fiber: { type: Number },
  sugar: { type: Number },
  cholesterol: { type: Number },
  explanation: { type: String }, // Optional explanation field
  imageUrl: { type: String }, // Field to store image URL
  date: { type: Date, default: Date.now }, // Automatically store the date
});


// Create the FoodHistory model
const FoodHistory = mongoose.model('FoodHistory', foodHistorySchema);

// Export the model
module.exports = FoodHistory;

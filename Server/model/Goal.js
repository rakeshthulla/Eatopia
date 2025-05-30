const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  goal: String,
  currentWeight: {
    value: Number,
    unit: { type: String, default: 'kg' }
  },
  goalWeight: {
    value: Number,
    unit: { type: String, default: 'kg' }
  },
  height: {
    value: Number,
    unit: { type: String, default: 'cm' }
  },
  activity: String,
  medicalIssues: String,
  foodPreferences: String
});

module.exports = mongoose.model('Goal', goalSchema);
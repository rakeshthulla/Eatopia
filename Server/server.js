const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const passport = require('passport');
const session = require('express-session');

dotenv.config();

const authRoutes = require('./routes/auth');
const goalRoutes = require('./routes/goal');
const foodHistoryRoutes = require('./routes/foodHistory');
require('./config/passport'); // Import the passport configuration

const app = express();
const PORT = process.env.PORT || 8000;

// Protect routes with the authenticate middleware
const authenticate = require('./middleware/authenticate');

// ======= MIDDLEWARE =======
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Allows large base64 images

app.use(session({
  secret: process.env.JWT_SECRET, // or another secret string
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true if using HTTPS
}));

app.use(passport.initialize());
app.use(passport.session());

// ======= ROUTES =======
app.use('/api/auth', authRoutes); // Public routes
app.use('/api/goal', authenticate, goalRoutes); // Protected 🎯 User goals
app.use('/api/food-history', authenticate, foodHistoryRoutes); // Protected 🍽️ Food + nutrition history

// ======= TEST ROUTE =======
app.get('/', (req, res) => {
  res.send('✅ Server is up and running!');
});

// ======= DATABASE + SERVER =======
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB connected');
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
});

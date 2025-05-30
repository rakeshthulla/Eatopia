const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../model/User');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
    if (!email) {
      console.log('❌ No email found in Google profile'); // Debugging log
      return done(null, false, { message: 'No email found in Google profile' });
    }

    // Check if the user exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ User not found in the database'); // Debugging log
      return done(null, false, { message: 'Email not registered' });
    }

    console.log('✅ User found in the database:', user); // Debugging log
    done(null, user);
  } catch (err) {
    console.error('❌ Error in GoogleStrategy:', err); // Debugging log
    done(err, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});